import { FastifyRequest, FastifyReply } from "fastify";
import { galleryService } from "./gallery.service";
import { validateCreateGallery } from "./gallery.validator";
import { CreateGalleryBody, UpdateGalleryBody, GalleryIdParam, GalleryQuerystring } from "./gallery.interface";

export async function getAllGallery(req: FastifyRequest<{ Querystring: GalleryQuerystring }>, reply: FastifyReply): Promise<void> {
  try { reply.send(await galleryService.findAll(req.query.type)); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch gallery events" }); }
}

export async function getGalleryById(req: FastifyRequest<{ Params: GalleryIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const event = await galleryService.findById(Number(req.params.id));
    if (!event) { reply.status(404).send({ error: "Gallery event not found" }); return; }
    reply.send(event);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch gallery event" }); }
}

export async function createGallery(req: FastifyRequest<{ Body: CreateGalleryBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateGallery(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await galleryService.create(body as unknown as CreateGalleryBody & { createdBy?: number });
    if ("conflict" in result) { reply.status(409).send({ error: "Slug already exists" }); return; }
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create gallery entry" }); }
}

export async function updateGallery(req: FastifyRequest<{ Params: GalleryIdParam; Body: UpdateGalleryBody }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await galleryService.update(Number(req.params.id), req.body as Partial<UpdateGalleryBody>);
    if ("notFound"   in result) { reply.status(404).send({ error: "Gallery event not found" }); return; }
    if ("badRequest" in result) { reply.status(400).send({ error: result.badRequest }); return; }
    if ("conflict"   in result) { reply.status(409).send({ error: "Slug already exists" }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update gallery entry" }); }
}

export async function deleteGallery(req: FastifyRequest<{ Params: GalleryIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await galleryService.delete(Number(req.params.id));
    if ("notFound" in result) { reply.status(404).send({ error: "Gallery event not found" }); return; }
    reply.send({ success: true });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to delete gallery entry" }); }
}
