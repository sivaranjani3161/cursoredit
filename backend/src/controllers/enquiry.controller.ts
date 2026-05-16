import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Enquiry } from "../entities/Enquiry";
import { EnquiryStatus } from "../entities/enums/EnquiryStatus";
import { CreateEnquiryBody, UpdateEnquiryBody, EnquiryIdParam } from "../interfaces/enquiry.interface";
import { normalizeEmail, toNullableStr, toNullableInt } from "../utils/stringHelpers";
import { validateCreateEnquiry, validateUpdateEnquiry } from "../validators";

const repo = () => AppDataSource.getRepository(Enquiry);

export async function getAllEnquiries(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const enquiries = await repo().find({
      relations: ["course"],
      order: { createdAt: "DESC" },
    });
    reply.send(enquiries);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch enquiries" });
  }
}

export async function getEnquiryById(
  req: FastifyRequest<{ Params: EnquiryIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const enquiry = await repo().findOne({ where: { id }, relations: ["course"] });
    if (!enquiry) { reply.status(404).send({ error: "Enquiry not found" }); return; }
    reply.send(enquiry);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch enquiry" });
  }
}

export async function createEnquiry(
  req: FastifyRequest<{ Body: CreateEnquiryBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateEnquiry(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const enquiry = repo().create({
      fullName: String(body.fullName).trim(),
      email: normalizeEmail(body.email),
      phone: toNullableStr(body?.phone),
      message: toNullableStr(body?.message),
      courseId: toNullableInt(body?.courseId),
      status: Object.values(EnquiryStatus).includes(body?.status as EnquiryStatus)
        ? (body.status as EnquiryStatus)
        : EnquiryStatus.NEW,
    });

    const saved = await repo().save(enquiry);
    reply.status(201).send(saved);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to create enquiry" });
  }
}

export async function updateEnquiry(
  req: FastifyRequest<{ Params: EnquiryIdParam; Body: UpdateEnquiryBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const body = req.body as unknown as Record<string, unknown>;

    const validation = validateUpdateEnquiry(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const enquiry = await repo().findOne({ where: { id } });
    if (!enquiry) { reply.status(404).send({ error: "Enquiry not found" }); return; }

    if (body?.fullName !== undefined) enquiry.fullName = String(body.fullName).trim();
    if (body?.email !== undefined) enquiry.email = normalizeEmail(body.email);
    if (body?.phone !== undefined) enquiry.phone = toNullableStr(body.phone);
    if (body?.message !== undefined) enquiry.message = toNullableStr(body.message);
    if (body?.courseId !== undefined) enquiry.courseId = toNullableInt(body.courseId);
    if (body?.status !== undefined && Object.values(EnquiryStatus).includes(body.status as EnquiryStatus))
      enquiry.status = body.status as EnquiryStatus;

    const updated = await repo().save(enquiry);
    reply.send(updated);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update enquiry" });
  }
}

export async function deleteEnquiry(
  req: FastifyRequest<{ Params: EnquiryIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const enquiry = await repo().findOne({ where: { id } });
    if (!enquiry) { reply.status(404).send({ error: "Enquiry not found" }); return; }
    await repo().remove(enquiry);
    reply.send({ success: true });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete enquiry" });
  }
}
