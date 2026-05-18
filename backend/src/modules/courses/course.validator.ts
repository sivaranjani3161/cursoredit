import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";

export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true,  errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateCreateCourse(body: Record<string, unknown>): ValidationResult {
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
  return errors.length ? fail(errors) : ok();
}

export function validateUpdateCourse(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  if (body?.slug !== undefined) {
    const slug = String(body.slug).trim();
    if (!slug) errors.push({ field: "slug", message: MSG.CANNOT_BE_EMPTY("slug") });
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      errors.push({ field: "slug", message: MSG.INVALID_FORMAT("slug", MSG.SLUG_FORMAT) });
  }
  if (body?.title !== undefined && !String(body.title).trim())
    errors.push({ field: "title", message: MSG.CANNOT_BE_EMPTY("title") });
  return errors.length ? fail(errors) : ok();
}
