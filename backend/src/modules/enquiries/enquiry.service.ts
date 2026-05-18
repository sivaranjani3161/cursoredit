import { AppDataSource } from "../../config/data-source";
import { Enquiry } from "../../entities/Enquiry";
import { EnquiryStatus } from "../../entities/enums/EnquiryStatus";
import { normalizeEmail, toNullableStr, toNullableInt } from "../../shared/utils/stringHelpers";
import { CreateEnquiryBody, UpdateEnquiryBody } from "./enquiry.interface";

const repo = () => AppDataSource.getRepository(Enquiry);

export const enquiryService = {
  findAll: async () =>
    repo().find({ relations: ["course"], order: { createdAt: "DESC" } }),

  findById: async (id: number) =>
    repo().findOne({ where: { id }, relations: ["course"] }),

  create: async (body: CreateEnquiryBody) => {
    const enquiry = repo().create({
      fullName: String(body.fullName).trim(),
      email:    normalizeEmail(body.email),
      phone:    toNullableStr(body.phone),
      message:  toNullableStr(body.message),
      courseId: toNullableInt(body.courseId),
      status:   Object.values(EnquiryStatus).includes(body.status as EnquiryStatus)
        ? (body.status as EnquiryStatus)
        : EnquiryStatus.NEW,
    });
    const saved = await repo().save(enquiry);
    return { data: saved };
  },

  update: async (id: number, body: Partial<UpdateEnquiryBody>) => {
    const enquiry = await repo().findOne({ where: { id } });
    if (!enquiry) return { notFound: true as const };

    if (body.fullName !== undefined) enquiry.fullName = String(body.fullName).trim();
    if (body.email    !== undefined) enquiry.email    = normalizeEmail(body.email);
    if (body.phone    !== undefined) enquiry.phone    = toNullableStr(body.phone);
    if (body.message  !== undefined) enquiry.message  = toNullableStr(body.message);
    if (body.courseId !== undefined) enquiry.courseId = toNullableInt(body.courseId);
    if (body.status   !== undefined && Object.values(EnquiryStatus).includes(body.status as EnquiryStatus))
      enquiry.status = body.status as EnquiryStatus;

    const updated = await repo().save(enquiry);
    return { data: updated };
  },

  delete: async (id: number) => {
    const enquiry = await repo().findOne({ where: { id } });
    if (!enquiry) return { notFound: true as const };
    await repo().remove(enquiry);
    return { success: true as const };
  },
};
