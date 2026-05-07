"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const db_1 = __importDefault(require("./plugins/db"));
const health_1 = __importDefault(require("./routes/health"));
const buildApp = async () => {
    const app = (0, fastify_1.default)({
        logger: {
            transport: process.env.NODE_ENV !== "production"
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
    await app.register(cors_1.default, {
        origin: "*", // Configure this to specific origins in production
    });
    await app.register(helmet_1.default, {
        global: true,
    });
    // Swagger Documentation Setup
    await app.register(swagger_1.default, {
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
    await app.register(swagger_ui_1.default, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false,
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
    });
    // Database Plugin (TypeORM)
    await app.register(db_1.default);
    // API Routes
    await app.register(health_1.default, { prefix: "/api" });
    return app;
};
exports.buildApp = buildApp;
