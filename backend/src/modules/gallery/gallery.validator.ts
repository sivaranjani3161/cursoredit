import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";
export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateCreateGallery(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const type = body?.type;
  if (type !== "internal" && type !== "external")
    errors.push({ field: "type", message: MSG.INVALID_ENUM("type", '"internal", "external"') });
  if (type === "external") {
    if (!String(body?.title ?? "").trim()) errors.push({ field: "title", message: MSG.REQUIRED("title") });
    if (!String(body?.slug  ?? "").trim()) errors.push({ field: "slug",  message: MSG.REQUIRED("slug") });
    const createdBy = Number(body?.createdBy);
    if (Number.isNaN(createdBy) || createdBy <= 0)
      errors.push({ field: "createdBy", message: MSG.REQUIRED("createdBy") });
  }
  if (type === "internal" && !String(body?.imageUrl ?? "").trim())
    errors.push({ field: "imageUrl", message: MSG.REQUIRED("imageUrl") });
  return errors.length ? fail(errors) : ok();
}
