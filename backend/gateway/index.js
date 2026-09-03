import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controller/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from "morgan";

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies to be sent
  }),
);

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE_URL));
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE_URL));
app.use(
  "/api/billing",
  protect,
  proxyWithHeader(process.env.BILLING_SERVICE_URL),
);

app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  res.json({ message: "Hello From Gateway Service" });
});

app.use((err, req, res, next) => {
  console.error("[gateway error]", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
