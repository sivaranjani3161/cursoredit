"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const healthRoutes = async (fastify) => {
    fastify.get("/health", {
        schema: {
            description: "Health check endpoint",
            tags: ["System"],
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        timestamp: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    }, async (request, reply) => {
        return { status: "ok", timestamp: new Date().toISOString() };
    });
};
exports.default = healthRoutes;
