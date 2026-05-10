"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = awesomeClickRoutes;
const data_source_1 = require("../config/data-source");
const AwesomeClick_1 = require("../entities/AwesomeClick");
async function awesomeClickRoutes(app) {
    const repo = data_source_1.AppDataSource.getRepository(AwesomeClick_1.AwesomeClick);
    app.get("/awesome-clicks", async (_req, reply) => {
        try {
            const rows = await repo.find({ order: { createdAt: "ASC", id: "ASC" } });
            return reply.send(rows);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch awesome clicks" });
        }
    });
    app.get("/awesome-clicks/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const row = await repo.findOne({ where: { id } });
            if (!row)
                return reply.status(404).send({ error: "Awesome click not found" });
            return reply.send(row);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch awesome click" });
        }
    });
    app.post("/awesome-clicks", async (req, reply) => {
        try {
            const body = req.body;
            const imageUrl = String(body?.imageUrl ?? "").trim();
            if (!imageUrl) {
                return reply.status(400).send({ error: "imageUrl is required" });
            }
            const row = repo.create({
                imageUrl,
                altText: body?.altText ? String(body.altText) : null,
            });
            const saved = await repo.save(row);
            return reply.status(201).send(saved);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to create awesome click" });
        }
    });
    app.put("/awesome-clicks/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const body = req.body;
            const row = await repo.findOne({ where: { id } });
            if (!row)
                return reply.status(404).send({ error: "Awesome click not found" });
            if (body?.imageUrl !== undefined) {
                const imageUrl = String(body.imageUrl ?? "").trim();
                if (!imageUrl)
                    return reply.status(400).send({ error: "imageUrl is required" });
                row.imageUrl = imageUrl;
            }
            if (body?.altText !== undefined)
                row.altText = body.altText ? String(body.altText) : null;
            const updated = await repo.save(row);
            return reply.send(updated);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to update awesome click" });
        }
    });
    app.delete("/awesome-clicks/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const row = await repo.findOne({ where: { id } });
            if (!row)
                return reply.status(404).send({ error: "Awesome click not found" });
            await repo.remove(row);
            return reply.send({ success: true });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to delete awesome click" });
        }
    });
}
