import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, "../config/.env.dev") });

import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./module/auth/auth.controller";
import userRouter from "./module/user/user.controller";
import { globalErrorHandler } from "./utils/errors/error.response";
import { connectDB } from "./DB/connection";

const app: Express = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: "Too many requests" },
});

app.use(cors(), express.json(), helmet(), limiter);

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use(globalErrorHandler);

app.get("/", (req, res) => res.json({ status: "ok" }));

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;
