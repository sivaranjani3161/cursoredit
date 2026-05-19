"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = healthRoutes;
async function healthRoutes(app) {
    app.get("/health", async (_req, reply) => {
        reply.send({ status: "ok", timestamp: new Date().toISOString() });
    });
}
