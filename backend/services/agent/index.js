import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "HELLO FROM AGENT" });
});

app.use("/", router);

app.use((err, req, res, next) => {
  console.error("[Agent Service Error]:", err);

  const status = err.status || err.statusCode || 500;

  return res.status(status).json({
    success: false,
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`AGENT SERVICE is running on port ${PORT}`);
  connectDB();
});


