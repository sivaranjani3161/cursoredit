import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import dbPlugin from "./plugins/db";
import healthRoutes from "./routes/health";
import roleRoutes from "./routes/roles";
import userRoutes from "./routes/users";
import permissionRoutes from "./routes/permissions";
import courseRoutes from "./routes/courses";
import uploadRoutes from "./routes/upload";
import blogRoutes from "./routes/blogs";
import testimonialRoutes from "./routes/testimonials";
import galleryRoutes from "./routes/gallery";
import enquiryRoutes from "./routes/enquiries";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import * as path from "path";
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

  // Core Plugins
  await app.register(cors, {
    origin: "*", 
  });
  
  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false, // Allow finestapp (port 3002) to load images from backend (port 3001)
  });

  await app.register(multipart);
  
  await app.register(staticPlugin, {
    root: path.join(__dirname, "../public/uploads"),
    prefix: "/uploads/",
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Finestapp API",
        description: "API documentation for Finestapp",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3001",
        },
      ],
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

  // Database Plugin (TypeORM)
  await app.register(dbPlugin);

  // API Routes
  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(roleRoutes, { prefix: "/api" });
  await app.register(userRoutes, { prefix: "/api" });
  await app.register(permissionRoutes, { prefix: "/api" });
await app.register(courseRoutes, {
  prefix: "/api",
});
await app.register(blogRoutes, {
  prefix: "/api",
});
await app.register(testimonialRoutes, {
  prefix: "/api",
});
await app.register(galleryRoutes, {
  prefix: "/api",
});

await app.register(enquiryRoutes, {
  prefix: "/api",
});
await app.register(uploadRoutes, {
  prefix: "/api",
});
  return app;
};
