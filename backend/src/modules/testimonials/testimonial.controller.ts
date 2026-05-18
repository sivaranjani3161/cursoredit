import { FastifyRequest, FastifyReply } from "fastify";
import { testimonialService } from "./testimonial.service";
import { validateCreateTestimonial } from "./testimonial.validator";
import { TestimonialIdParam, CreateTestimonialBody, UpdateTestimonialBody } from "./testimonial.interface";

export async function getAllTestimonials(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await testimonialService.findAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch testimonials" }); }
}

export async function getTestimonialById(req: FastifyRequest<{ Params: TestimonialIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const item = await testimonialService.findById(Number(req.params.id));
    if (!item) { reply.status(404).send({ error: "Testimonial not found" }); return; }
    reply.send(item);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch testimonial" }); }
}

export async function createTestimonial(req: FastifyRequest<{ Body: CreateTestimonialBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateTestimonial(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await testimonialService.create({ ...(body as unknown as CreateTestimonialBody), createdBy: Number(body.createdBy) });
    if ("badRequest" in result) { reply.status(400).send({ error: result.badRequest }); return; }
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create testimonial" }); }
}

export async function updateTestimonial(req: FastifyRequest<{ Params: TestimonialIdParam; Body: UpdateTestimonialBody }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await testimonialService.update(Number(req.params.id), req.body as Partial<UpdateTestimonialBody>);
    if ("notFound"   in result) { reply.status(404).send({ error: "Testimonial not found" }); return; }
    if ("badRequest" in result) { reply.status(400).send({ error: result.badRequest }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update testimonial" }); }
}

export async function deleteTestimonial(req: FastifyRequest<{ Params: TestimonialIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await testimonialService.delete(Number(req.params.id));
    if ("notFound" in result) { reply.status(404).send({ error: "Testimonial not found" }); return; }
    reply.send({ success: true });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to delete testimonial" }); }
}
