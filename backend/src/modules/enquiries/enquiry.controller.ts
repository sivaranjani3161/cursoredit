import { FastifyRequest, FastifyReply } from "fastify";
import { enquiryService } from "./enquiry.service";
import { validateCreateEnquiry, validateUpdateEnquiry } from "./enquiry.validator";
import { EnquiryIdParam, CreateEnquiryBody, UpdateEnquiryBody } from "./enquiry.interface";

export async function getAllEnquiries(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await enquiryService.findAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch enquiries" }); }
}

export async function getEnquiryById(req: FastifyRequest<{ Params: EnquiryIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const item = await enquiryService.findById(Number(req.params.id));
    if (!item) { reply.status(404).send({ error: "Enquiry not found" }); return; }
    reply.send(item);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch enquiry" }); }
}

export async function createEnquiry(req: FastifyRequest<{ Body: CreateEnquiryBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateEnquiry(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await enquiryService.create(body as unknown as CreateEnquiryBody);
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create enquiry" }); }
}

export async function updateEnquiry(req: FastifyRequest<{ Params: EnquiryIdParam; Body: UpdateEnquiryBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateUpdateEnquiry(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await enquiryService.update(Number(req.params.id), body as Partial<UpdateEnquiryBody>);
    if ("notFound" in result) { reply.status(404).send({ error: "Enquiry not found" }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update enquiry" }); }
}

export async function deleteEnquiry(req: FastifyRequest<{ Params: EnquiryIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await enquiryService.delete(Number(req.params.id));
    if ("notFound" in result) { reply.status(404).send({ error: "Enquiry not found" }); return; }
    reply.send({ success: true });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to delete enquiry" }); }
}
