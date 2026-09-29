import dotenv from "dotenv";
import express from "express";
import { Application, Request, Response } from "express";
import { isDBConnected } from "../src/database/db";
import authRoutes from "../src/routes/auth.routes";
import { connectRedis } from "@config/redis";
import cookieParser from "cookie-parser";
import adminRoutes from "../src/routes/admin.routes"

dotenv.config();

const app: Application = express();
app.use(express.json());

const port = process.env.PORT;

app.get("/health", (req: Request, res: Response) => {
  res.json({
    message: "server is healthy",
  });
});

app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/admin",adminRoutes)

app.listen(port, async () => {
  console.log(`server is running on port: ${port}`);
  isDBConnected();
  await connectRedis();
});
