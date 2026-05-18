import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import * as path from "path";

import dbPlugin from "./shared/plugins/db";

// ─── Module Routes ────────────────────────────────────────────────────────────
import healthRoutes          from "./modules/health/health.routes";
import roleRoutes            from "./modules/roles/role.routes";
import userRoutes            from "./modules/users/user.routes";
import permissionRoutes      from "./modules/permissions/permission.routes";
import courseRoutes          from "./modules/courses/course.routes";
import courseCategoryRoutes  from "./modules/course-categories/courseCategory.routes";
import blogRoutes            from "./modules/blogs/blog.routes";
import testimonialRoutes     from "./modules/testimonials/testimonial.routes";
import galleryRoutes         from "./modules/gallery/gallery.routes";
import enquiryRoutes         from "./modules/enquiries/enquiry.routes";
import uploadRoutes          from "./modules/upload/upload.routes";

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" } }
          : undefined,
    },
  });

  // ─── Core Plugins ──────────────────────────────────────────────────────────
  await app.register(cors, { origin: process.env.CORS_ORIGIN ?? "*" });

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  });

  await app.register(multipart);

  await app.register(staticPlugin, {
    root:   path.join(__dirname, "../public/uploads"),
    prefix: "/uploads/",
  });

  // ─── API Documentation ─────────────────────────────────────────────────────
  await app.register(swagger, {
    openapi: {
      info: { title: "Finestapp API", description: "REST API documentation for Finestapp", version: "1.0.0" },
      servers: [{ url: process.env.BACKEND_URL ?? "http://localhost:3001" }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "full", deepLinking: false },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // ─── Database ──────────────────────────────────────────────────────────────
  await app.register(dbPlugin);

  // ─── API Routes ────────────────────────────────────────────────────────────
  // All routes are prefixed with /api.
  // Static sub-paths (e.g. /courses/active) are registered BEFORE wildcard
  // params (e.g. /courses/:id) inside each module's route file.
  const API = { prefix: "/api" };

  await app.register(healthRoutes,         API);
  await app.register(roleRoutes,           API);
  await app.register(userRoutes,           API);
  await app.register(permissionRoutes,     API);
  await app.register(courseRoutes,         API);
  await app.register(courseCategoryRoutes, API);
  await app.register(blogRoutes,           API);
  await app.register(testimonialRoutes,    API);
  await app.register(galleryRoutes,        API);
  await app.register(enquiryRoutes,        API);
  await app.register(uploadRoutes,         API);

  return app;
};
