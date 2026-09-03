import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/billing.route.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/", router);

app.get("/", (req, res) => {
  res.json({ message: "HELLO FROM BILLING SERVICE" });
});

app.listen(PORT, () => {
  console.log(`BILLING SERVICE is running on port ${PORT}`);
  connectDB();
});
