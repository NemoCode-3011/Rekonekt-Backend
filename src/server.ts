import dotenv from "dotenv";
import express from "express";
import { Application, Request, Response } from "express";
import { isDBConnected } from "../src/database/db";
import authRoutes from "../src/routes/auth.routes";
import { connectRedis } from "@config/redis";
import cookieParser from "cookie-parser";
import adminRoutes from "../src/routes/admin.routes";
import exhibitRoutes from "../src/routes/exhibitions.routes";
import sectionRoutes from "../src/routes/sections.routes";
import storyRoutes from "../src/routes/stories.routes";
import eventRoutes from "../src/routes/event.routes";
import personRoutes from "../src/routes/people.routes";
import placeRoutes from "../src/routes/places.routes";
import eventPeopleRoutes from "../src/routes/eventPeople.routes";

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
app.use("/admin", adminRoutes);
app.use("/exhibitions", exhibitRoutes);
app.use("/sections", sectionRoutes);
app.use("/stories", storyRoutes);
app.use("/events", eventRoutes);
app.use("/people", personRoutes);
app.use("/places", placeRoutes);
app.use("/", eventPeopleRoutes);

app.listen(port, async () => {
  console.log(`server is running on port: ${port}`);
  isDBConnected();
  await connectRedis();
});
