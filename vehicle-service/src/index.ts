import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { vehicleRouter } from "./routes/vehicle.routes";
import { healthRouter } from "./routes/health";
import { errorMiddleware } from "./middlewares/error";
import { startUserCreatedConsumer } from "./rabbit/consumer";

const app = express();
app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());

app.use(healthRouter);
app.use(vehicleRouter);
app.use(errorMiddleware);

const port = Number(process.env.PORT ?? 3002);
app.listen(port, "0.0.0.0", () => {
  console.log(`[vehicle-service] listening on :${port}`);
  startUserCreatedConsumer(); 
});

