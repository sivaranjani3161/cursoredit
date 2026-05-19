import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";
export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateCreateCourseCategory(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const name = String(body?.name ?? "").trim();
  if (!name) errors.push({ field: "name", message: MSG.REQUIRED("name") });
  if (body?.slug !== undefined) {
    const slug = String(body.slug).trim();
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      errors.push({ field: "slug", message: MSG.INVALID_FORMAT("slug", MSG.SLUG_FORMAT) });
  }
  return errors.length ? fail(errors) : ok();
}
