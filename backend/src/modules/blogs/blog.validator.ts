import { BlogStatus } from "../../entities/enums/BlogStatus";
import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";

export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }

const ok   = (): ValidationResult => ({ valid: true,  errors: [] });
const fail = (errors: ValidationError[]): ValidationResult => ({ valid: false, errors });

export function validateCreateBlog(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const title = String(body?.title ?? "").trim();
  const slug  = String(body?.slug  ?? "").trim();
  const createdBy = Number(body?.createdBy);

  if (!title) errors.push({ field: "title", message: MSG.REQUIRED("title") });
  if (!slug)  errors.push({ field: "slug",  message: MSG.REQUIRED("slug") });
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    errors.push({ field: "slug", message: MSG.INVALID_FORMAT("slug", MSG.SLUG_FORMAT) });
  if (Number.isNaN(createdBy) || createdBy <= 0)
    errors.push({ field: "createdBy", message: MSG.INVALID_ID("createdBy") });
  if (body?.status !== undefined && !Object.values(BlogStatus).includes(body.status as BlogStatus))
    errors.push({ field: "status", message: MSG.INVALID_ENUM("status", Object.values(BlogStatus).join(", ")) });

  return errors.length ? fail(errors) : ok();
}

export function validateUpdateBlog(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (body?.slug !== undefined) {
    const slug = String(body.slug).trim();
    if (!slug) errors.push({ field: "slug", message: MSG.CANNOT_BE_EMPTY("slug") });
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      errors.push({ field: "slug", message: MSG.INVALID_FORMAT("slug", MSG.SLUG_FORMAT) });
  }
  if (body?.status !== undefined && !Object.values(BlogStatus).includes(body.status as BlogStatus))
    errors.push({ field: "status", message: MSG.INVALID_ENUM("status", Object.values(BlogStatus).join(", ")) });

  return errors.length ? fail(errors) : ok();
}
