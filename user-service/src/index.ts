import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user.routes";
import { healthRouter } from "./routes/health";
import { errorMiddleware } from "./middlewares/error";


const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use(healthRouter);
app.use(userRouter);

app.use(errorMiddleware);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`[user-service] listening on :${port}`);
});
