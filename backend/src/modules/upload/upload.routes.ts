import { FastifyInstance } from "fastify";
import { uploadFile } from "./upload.controller";

export default async function uploadRoutes(app: FastifyInstance): Promise<void> {
  app.post("/upload", uploadFile);
}
