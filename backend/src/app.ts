import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import * as path from "path";

import dbPlugin from "./plugins/db";

// ─── Route imports ────────────────────────────────────────────────────────────
import healthRoutes from "./routes/health";
import roleRoutes from "./routes/roles";
import userRoutes from "./routes/users";
import permissionRoutes from "./routes/permissions";
import courseRoutes from "./routes/courses";
import courseCategoryRoutes from "./routes/courseCategories";
import blogRoutes from "./routes/blogs";
import testimonialRoutes from "./routes/testimonials";
import galleryRoutes from "./routes/gallery";
import enquiryRoutes from "./routes/enquiries";
import uploadRoutes from "./routes/upload";

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  // ─── Core plugins ──────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "*",
  });

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
    // Allow the Next.js frontend to load images served from the backend
    crossOriginResourcePolicy: false,
  });

  await app.register(multipart);

  await app.register(staticPlugin, {
    root: path.join(__dirname, "../public/uploads"),
    prefix: "/uploads/",
  });

  // ─── Swagger (API docs) ────────────────────────────────────────────────────
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Finestapp API",
        description: "REST API documentation for Finestapp",
        version: "1.0.0",
      },
      servers: [{ url: process.env.BACKEND_URL ?? "http://localhost:3001" }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // ─── Database ──────────────────────────────────────────────────────────────
  await app.register(dbPlugin);

  // ─── API Routes ───────────────────────────────────────────────────────────
  // All routes are prefixed with /api.
  // Order matters: static sub-paths (e.g. /courses/active) must be registered
  // before wildcard params (e.g. /courses/:id) — this is handled inside each
  // route file, not here.
  const API_PREFIX = { prefix: "/api" };

  await app.register(healthRoutes,        API_PREFIX);
  await app.register(roleRoutes,          API_PREFIX);
  await app.register(userRoutes,          API_PREFIX);
  await app.register(permissionRoutes,    API_PREFIX);
  await app.register(courseRoutes,        API_PREFIX);
  await app.register(courseCategoryRoutes,API_PREFIX);
  await app.register(blogRoutes,          API_PREFIX);
  await app.register(testimonialRoutes,   API_PREFIX);
  await app.register(galleryRoutes,       API_PREFIX);
  await app.register(enquiryRoutes,       API_PREFIX);
  await app.register(uploadRoutes,        API_PREFIX);

  return app;
};
