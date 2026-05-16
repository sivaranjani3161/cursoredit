import { FastifyInstance } from "fastify";
import {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiry.controller";
import { EnquiryIdParam, CreateEnquiryBody, UpdateEnquiryBody } from "../interfaces/enquiry.interface";

export default async function enquiryRoutes(app: FastifyInstance): Promise<void> {
  app.get("/enquiries", getAllEnquiries);
  app.get<{ Params: EnquiryIdParam }>("/enquiries/:id", getEnquiryById);
  app.post<{ Body: CreateEnquiryBody }>("/enquiries", createEnquiry);
  app.put<{ Params: EnquiryIdParam; Body: UpdateEnquiryBody }>("/enquiries/:id", updateEnquiry);
  app.delete<{ Params: EnquiryIdParam }>("/enquiries/:id", deleteEnquiry);
}
