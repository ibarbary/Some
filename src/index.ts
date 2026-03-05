import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env") });

import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./module/auth/auth.controller";
import userRouter from "./module/user/user.controller";
import childrenRouter from "./module/children/children.controller";
import stagesRouter from "./module/stages/stages.controller";
import activityRouter from "./module/activity/activity.controller";
import sessionsRouter from "./module/sessions/sessions.controller";
import { globalErrorHandler } from "./utils/errors/error.response";
import { connectDB } from "./DB/connection";

const app: Express = express();

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: "Too many requests" },
});

app.use(cors(), express.json(), helmet(), limiter);

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/children", childrenRouter);
app.use("/api/stages", stagesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/activity", activityRouter);
app.use(globalErrorHandler);

app.get("/", (req, res) => res.json({ message: "Hello Lexi" }));

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;
