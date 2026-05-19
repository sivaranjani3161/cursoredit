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
const multipart_1 = __importDefault(require("@fastify/multipart"));
const static_1 = __importDefault(require("@fastify/static"));
const path = __importStar(require("path"));
const db_1 = __importDefault(require("./shared/plugins/db"));
// ─── Module Routes ────────────────────────────────────────────────────────────
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const role_routes_1 = __importDefault(require("./modules/roles/role.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const permission_routes_1 = __importDefault(require("./modules/permissions/permission.routes"));
const course_routes_1 = __importDefault(require("./modules/courses/course.routes"));
const courseCategory_routes_1 = __importDefault(require("./modules/course-categories/courseCategory.routes"));
const blog_routes_1 = __importDefault(require("./modules/blogs/blog.routes"));
const testimonial_routes_1 = __importDefault(require("./modules/testimonials/testimonial.routes"));
const gallery_routes_1 = __importDefault(require("./modules/gallery/gallery.routes"));
const enquiry_routes_1 = __importDefault(require("./modules/enquiries/enquiry.routes"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const buildApp = async () => {
    const app = (0, fastify_1.default)({
        logger: {
            transport: process.env.NODE_ENV !== "production"
                ? { target: "pino-pretty", options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" } }
                : undefined,
        },
    });
    // ─── Core Plugins ──────────────────────────────────────────────────────────
    await app.register(cors_1.default, { origin: process.env.CORS_ORIGIN ?? "*" });
    await app.register(helmet_1.default, {
        global: true,
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
    });
    await app.register(multipart_1.default);
    await app.register(static_1.default, {
        root: path.join(__dirname, "../public/uploads"),
        prefix: "/uploads/",
    });
    // ─── API Documentation ─────────────────────────────────────────────────────
    await app.register(swagger_1.default, {
        openapi: {
            info: { title: "Finestapp API", description: "REST API documentation for Finestapp", version: "1.0.0" },
            servers: [{ url: process.env.BACKEND_URL ?? "http://localhost:3001" }],
        },
    });
    await app.register(swagger_ui_1.default, {
        routePrefix: "/docs",
        uiConfig: { docExpansion: "full", deepLinking: false },
        staticCSP: true,
        transformStaticCSP: (header) => header,
    });
    // ─── Database ──────────────────────────────────────────────────────────────
    await app.register(db_1.default);
    // ─── API Routes ────────────────────────────────────────────────────────────
    // All routes are prefixed with /api.
    // Static sub-paths (e.g. /courses/active) are registered BEFORE wildcard
    // params (e.g. /courses/:id) inside each module's route file.
    const API = { prefix: "/api" };
    await app.register(health_routes_1.default, API);
    await app.register(role_routes_1.default, API);
    await app.register(user_routes_1.default, API);
    await app.register(permission_routes_1.default, API);
    await app.register(course_routes_1.default, API);
    await app.register(courseCategory_routes_1.default, API);
    await app.register(blog_routes_1.default, API);
    await app.register(testimonial_routes_1.default, API);
    await app.register(gallery_routes_1.default, API);
    await app.register(enquiry_routes_1.default, API);
    await app.register(upload_routes_1.default, API);
    return app;
};
exports.buildApp = buildApp;
