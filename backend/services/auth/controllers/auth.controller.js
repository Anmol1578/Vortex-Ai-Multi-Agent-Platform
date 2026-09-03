import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import redis from "../../../shared/redis/redis.js";

// In production the frontend and backend live on different Render subdomains,
// so the session cookie must be SameSite=None + Secure or the browser will
// silently drop it on every cross-site request. Locally (http://localhost)
// "lax" + non-secure keeps working as before.
const isProd = process.env.NODE_ENV === "production";
const sessionCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({ firebaseId: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseId: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        plan: "free",
        credits: 100,
        totalCredits: 100,
      });
    }

    // For security, you should generate a session token and set it as an HTTP-only cookie. This will help prevent XSS attacks and ensure that the session is secure.

    const sessionToken = crypto.randomUUID();

    await redis.set(
      `user-session:${user._id}`,
      sessionToken,
      "EX",
      7 * 24 * 60 * 60,
    );

    await redis.set(
      `session:${sessionToken}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    ); // Set session to expire in 7 days

    res.cookie("session", sessionToken, {
      ...sessionCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionToken = req.cookies?.session;

    if (sessionToken) {
      // Get the session data before deleting it
      const sessionData = await redis.get(`session:${sessionToken}`);

      if (sessionData) {
        const user = JSON.parse(sessionData);

        // Delete user → session mapping
        await redis.del(`user-session:${user.userId}`);
      }

      // Delete session
      await redis.del(`session:${sessionToken}`);
    }

    res.clearCookie("session", sessionCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: `Error logging out: ${error.message}`,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan,
      credits: user.credits,
      totalCredits: user.totalCredits,
      planExpiresAt: user.planExpiresAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error fetching user: ${error.message}` });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    const { plan, credits, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = plan;
    user.credits = credits;
    user.totalCredits = credits;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    const sessionToken = await redis.get(`user-session:${user._id}`);

    if (sessionToken) {
      await redis.set(
        `session:${sessionToken}`,
        JSON.stringify({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        "EX",
        7 * 24 * 60 * 60,
      );
    }

    // return the updated user so callers (billing service) can pass it along
    return res.status(200).json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating user payment: ${error.message}` });
  }
};

export const deductUserCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;

    if (!userId || !agent) {
      return res.status(400).json({
        message: "userId and agent are required",
      });
    }

    const COST = {
      chat: 5,
      search: 15,
      coding: 30,
      pdf: 10,
      ppt: 10,
      vision: 20,
      pdfRag: 15,
      imageAnalyzer: 10,
    };

    const requiredCredits = COST[agent];

    if (!requiredCredits) {
      return res.status(400).json({
        message: `Invalid agent: ${agent}`,
      });
    }

    /*
     * Atomic credit deduction.
     *
     * MongoDB checks that the user has enough credits
     * AND deducts the credits in the same operation.
     *
     * This prevents two simultaneous requests from
     * spending the same credits.
     */
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        credits: { $gte: requiredCredits },
      },
      {
        $inc: {
          credits: -requiredCredits,
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!user) {
      // Check whether user actually exists
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(400).json({
        message: "Insufficient credits",
        credits: existingUser.credits,
        requiredCredits,
      });
    }

    /*
     * Find the user's active session.
     *
     * Login should create:
     *
     * user-session:${userId} -> sessionToken
     */
    const sessionToken = await redis.get(`user-session:${userId}`);

    if (sessionToken) {
      await redis.set(
        `session:${sessionToken}`,
        JSON.stringify({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        "EX",
        7 * 24 * 60 * 60,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Credits deducted successfully",
      agent,
      deductedCredits: requiredCredits,
      credits: user.credits,
    });
  } catch (error) {
    console.error("deductUserCredits error:", error);

    return res.status(500).json({
      message: `Error deducting user credits: ${error.message}`,
    });
  }
};
