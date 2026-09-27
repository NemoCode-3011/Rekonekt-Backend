import dotenv from "dotenv";
import express from "express";
import { Application, Request, Response } from "express";

dotenv.config();

const app: Application = express();
app.use(express.json());

const port = process.env.PORT;

app.get("/health", (req: Request, res: Response) => {
  res.json({
    message: "server is healthy",
  });
});

app.listen(port, async () => {
  console.log(`server is running on port: ${port}`);
});
