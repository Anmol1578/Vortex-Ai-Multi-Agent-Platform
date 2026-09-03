import crypto from "crypto";
import axios from "axios";

import { PLANS } from "../config/Plans.js";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        message: "User ID is required",
      });
    }

    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return res.status(404).json({
        message: "Invalid plan selected",
      });
    }

    // Check current plan via auth service — block re-purchasing the same plan
    const { data: authUser } = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/user/${userId}`,
    );

    if (authUser.plan === selectedPlan.id) {
      return res.status(400).json({
        message: "You are already subscribed to this plan",
      });
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.price * 100,
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
    });

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.price,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "created",
    });

    return res.status(200).json({
      success: true,
      order,
      plan: selectedPlan,
    });
  } catch (error) {
    console.error("createOrder error:", error);

    return res.status(500).json({
      message: `createOrder error: ${error.message}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    if (payment.status === "paid") {
      return res.status(400).json({
        message: "Payment already verified",
      });
    }

    payment.status = "paid";
    payment.paymentId = razorpay_payment_id;

    await payment.save();

    const { data: updateResult } = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/update-plan`,
      {
        userId: payment.userId,
        plan: payment.plan,
        credits: payment.credits,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and plan updated successfully",
      user: updateResult.user, // pass the fresh user object back to the frontend
    });
  } catch (error) {
    console.error("verifyPayment error:", error);

    return res.status(500).json({
      message: `verifyPayment error: ${error.message}`,
    });
  }
};
