import dotenv from "dotenv";
import express from "express";
import { Application, Request, Response } from "express";
import { createTables, isDBConnected } from "../src/database/db";
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
import eventMediaRoutes from "../src/routes/eventMedia.routes";
import eventPlaceRoutes from "../src/routes/eventPlace.routes";
import artifactRoutes from "../src/routes/artifacts.routes";
import mediaRoutes from "../src/routes/media.routes";
import mediaAttachmentRoutes from "../src/routes/mediaAttachment.routes";
import sourceRoutes from "../src/routes/source.routes";
import sourceLinkRoutes from "src/routes/sourceLink.routes";
import bookmarkRoutes from "src/routes/bookmarks.routes";
import noteRoutes from "src/routes/note.routes";
import progressRoutes from "src/routes/progress.routes";
import googleAuthRoutes from "src/routes/googleAuth.routes";
import searchRoutes from "src/routes/search.routes";
import contentRelationshipRoutes from "src/routes/contentRelationships.routes";
import experienceRoutes from "src/routes/experience.routes";
import culturalGroupRoutes from "../src/routes/culturalGroups.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../src/docs/swagger";
import cors from "cors";
import { errorHandler, notFoundHandler } from "@middleware/errorHandler";
import { publicReadLimiter } from "@middleware/rateLimit.middleware";
import { verifyRequestOrigin } from "@middleware/requestOrigin.middleware";
import { getClientUrl } from "@config/clientOrigin";

dotenv.config();

const app: Application = express();
// Requests reach this app through two proxies (Vercel, then Render), so trust
// two hops to see the real visitor IP. Without this every visitor shares
// one rate-limit bucket. Override with TRUST_PROXY_HOPS if the setup changes.
const proxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? "", 10);
app.set("trust proxy", Number.isInteger(proxyHops) && proxyHops >= 0 ? proxyHops : 2);

// Temporary check: set LOG_CLIENT_IP=true on Render, visit the site, then read
// the logs. "ip" should be your own address, not a Vercel one.
if (process.env.LOG_CLIENT_IP === "true") {
  app.use((req, _res, next) => {
    console.log("client ip:", req.ip, "forwarded chain:", req.ips);
    next();
  });
}

app.use(express.json());

const clientUrl = getClientUrl();
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);
app.use(verifyRequestOrigin(clientUrl));

const port = Number(process.env.PORT) || 3000;

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    message: "server is healthy",
  });
});

app.use(cookieParser());

// API docs list every route, so keep them off in production unless asked for.
if (
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_API_DOCS === "true"
) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Public reading needs no account, so cap how fast one IP can read.
app.use(publicReadLimiter);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/exhibitions", exhibitRoutes);
app.use("/sections", sectionRoutes);
app.use("/stories", storyRoutes);
app.use("/events", eventRoutes);
app.use("/people", personRoutes);
app.use("/places", placeRoutes);
app.use("/", eventPeopleRoutes);
app.use("/", eventPlaceRoutes);
app.use("/", eventMediaRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/media", mediaRoutes);
app.use("/media-attachment", mediaAttachmentRoutes);
app.use("/sources", sourceRoutes);
app.use("/source-links", sourceLinkRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/notes", noteRoutes);
app.use("/progress", progressRoutes);
app.use("/auth/google", googleAuthRoutes);
app.use("/search", searchRoutes);
app.use("/experiences", experienceRoutes);
app.use("/", contentRelationshipRoutes);
app.use("/cultural-groups", culturalGroupRoutes);

// Must come after every route.
app.use(notFoundHandler);
app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

const start = async () => {
  try {
    await connectRedis();
    // Safe to run on every start: every statement is IF NOT EXISTS.
    await createTables();
    
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
      isDBConnected();
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};



start();