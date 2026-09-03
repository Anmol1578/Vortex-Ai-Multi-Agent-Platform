import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
  try {
    const sessionToken = req.cookies?.session;

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const session = await redis.get(`session:${sessionToken}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session Expired",
      });
    }

    req.user = JSON.parse(session);

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default protect;
