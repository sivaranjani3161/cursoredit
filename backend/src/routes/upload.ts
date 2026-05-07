import { FastifyInstance } from "fastify";
import * as fs from "fs";
import * as path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export default async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (req, reply) => {
    try {
      const data = await req.file();
      if (!data) {
        return reply.status(400).send({ error: "No file uploaded" });
      }

      const uploadDir = path.join(__dirname, "../../public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${data.filename}`;
      const filePath = path.join(uploadDir, fileName);

      await pump(data.file, fs.createWriteStream(filePath));

      const fileUrl = `${process.env.BACKEND_URL || "http://localhost:3001"}/uploads/${fileName}`;

      return reply.send({
        url: fileUrl,
        fileName: fileName,
      });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to upload file" });
    }
  });
}
