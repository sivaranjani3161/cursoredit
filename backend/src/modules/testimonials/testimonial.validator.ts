import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";
export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateCreateTestimonial(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const createdBy = Number(body?.createdBy);
  if (Number.isNaN(createdBy) || createdBy <= 0)
    errors.push({ field: "createdBy", message: MSG.INVALID_ID("createdBy") });
  return errors.length ? fail(errors) : ok();
}
