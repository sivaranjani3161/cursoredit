"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const roles_1 = __importDefault(require("./routes/roles"));
const users_1 = __importDefault(require("./routes/users"));
const permissions_1 = __importDefault(require("./routes/permissions"));
const courses_1 = __importDefault(require("./routes/courses"));
const upload_1 = __importDefault(require("./routes/upload"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const static_1 = __importDefault(require("@fastify/static"));
const path = __importStar(require("path"));
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
        origin: "*",
    });
    await app.register(helmet_1.default, {
        global: true,
        contentSecurityPolicy: false,
    });
    await app.register(multipart_1.default);
    await app.register(static_1.default, {
        root: path.join(__dirname, "../public/uploads"),
        prefix: "/uploads/",
    });
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
    await app.register(roles_1.default, { prefix: "/api" });
    await app.register(users_1.default, { prefix: "/api" });
    await app.register(permissions_1.default, { prefix: "/api" });
    await app.register(courses_1.default, {
        prefix: "/api",
    });
    await app.register(blogs_1.default, {
        prefix: "/api",
    });
    await app.register(testimonials_1.default, {
        prefix: "/api",
    });
    await app.register(gallery_1.default, {
        prefix: "/api",
    });
    await app.register(enquiries_1.default, {
        prefix: "/api",
    });
    await app.register(upload_1.default, {
        prefix: "/api",
    });
    return app;
};
exports.buildApp = buildApp;
