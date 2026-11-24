import dotenv from "dotenv";
import express from "express";
import { Application, Request, Response } from "express";
import { createTables, isDBConnected } from "./database/db";
import authRoutes from "./routes/auth.routes";
import { connectRedis } from "./config/redis";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import exhibitRoutes from "./routes/exhibitions.routes";
import sectionRoutes from "./routes/sections.routes";
import storyRoutes from "./routes/stories.routes";
import eventRoutes from "./routes/event.routes";
import personRoutes from "./routes/people.routes";
import placeRoutes from "./routes/places.routes";
import eventPeopleRoutes from "./routes/eventPeople.routes";
import eventMediaRoutes from "./routes/eventMedia.routes";
import eventPlaceRoutes from "./routes/eventPlace.routes";
import artifactRoutes from "./routes/artifacts.routes";
import mediaRoutes from "./routes/media.routes";
import mediaAttachmentRoutes from "./routes/mediaAttachment.routes";
import sourceRoutes from "./routes/source.routes";
import sourceLinkRoutes from "./routes/sourceLink.routes";
import bookmarkRoutes from "./routes/bookmarks.routes";
import noteRoutes from "./routes/note.routes";
import progressRoutes from "./routes/progress.routes";
import googleAuthRoutes from "./routes/googleAuth.routes";
import searchRoutes from "./routes/search.routes";
import contentRelationshipRoutes from "./routes/contentRelationships.routes";
import experienceRoutes from "./routes/experience.routes";
import culturalGroupRoutes from "./routes/culturalGroups.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import cors from "cors";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { publicReadLimiter } from "./middleware/rateLimit.middleware";
import { verifyRequestOrigin } from "./middleware/requestOrigin.middleware";
import { getClientUrl } from "./config/clientOrigin";

dotenv.config();

const app: Application = express();
// Requests reach this app through two proxies (Vercel, then Render), so trust
// two hops to see the real visitor IP. Without this every visitor shares
// one rate-limit bucket. Override with TRUST_PROXY_HOPS if the setup changes.
const proxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? "", 10);
app.set("trust proxy", Number.isInteger(proxyHops) && proxyHops >= 0 ? proxyHops : 2);

//to check if correct ip
if (process.env.LOG_CLIENT_IP === "true") {
  app.use((req, _res, next) => {
    console.log(
      "client ip:",
      req.ip,
      "| x-forwarded-for:",
      req.headers["x-forwarded-for"],
      "| x-vercel-forwarded-for:",
      req.headers["x-vercel-forwarded-for"],
    );
    next();
  });
}

// API docs list every route, so keep them off in production unless asked for.
const docsEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_API_DOCS === "true";

// Standard security headers. Swagger UI needs inline scripts
app.use(helmet({ contentSecurityPolicy: docsEnabled ? false : undefined }));

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

if (docsEnabled) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}


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


app.use(notFoundHandler);
app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

const start = async () => {
  try {
    await connectRedis();
    
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