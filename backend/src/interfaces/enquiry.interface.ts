import { EnquiryStatus } from "../entities/enums/EnquiryStatus";

export interface CreateEnquiryBody {
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  courseId?: number | null;
  status?: EnquiryStatus;
}

export interface UpdateEnquiryBody {
  fullName?: string;
  email?: string;
  phone?: string | null;
  message?: string | null;
  courseId?: number | null;
  status?: EnquiryStatus;
}

export interface EnquiryIdParam {
  id: string;
}
