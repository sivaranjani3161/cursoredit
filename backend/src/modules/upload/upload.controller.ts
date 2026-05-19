import { FastifyRequest, FastifyReply } from "fastify";
import * as fs from "fs";
import * as path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export async function uploadFile(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const data = await req.file();
    if (!data) { reply.status(400).send({ error: "No file uploaded" }); return; }

    const uploadDir = path.join(__dirname, "../../../public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${data.filename}`;
    const filePath = path.join(uploadDir, fileName);
    await pump(data.file, fs.createWriteStream(filePath));

    const fileUrl = `${process.env.BACKEND_URL ?? "http://localhost:3001"}/uploads/${fileName}`;
    reply.send({ url: fileUrl, fileName });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to upload file" });
  }
}
