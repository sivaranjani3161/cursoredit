import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";
export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateCreateUser(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const email  = String(body?.email  ?? "").trim();
  const name   = String(body?.name   ?? "").trim();
  const roleId = Number(body?.roleId);
  if (!email) errors.push({ field: "email", message: MSG.REQUIRED("email") });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push({ field: "email", message: MSG.MUST_BE_VALID("email") });
  if (!name) errors.push({ field: "name", message: MSG.REQUIRED("name") });
  if (Number.isNaN(roleId) || roleId <= 0)
    errors.push({ field: "roleId", message: MSG.INVALID_ID("roleId") });
  return errors.length ? fail(errors) : ok();
}

export function validateUpdateUser(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  if (body?.email !== undefined) {
    const email = String(body.email).trim();
    if (!email) errors.push({ field: "email", message: MSG.CANNOT_BE_EMPTY("email") });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push({ field: "email", message: MSG.MUST_BE_VALID("email") });
  }
  if (body?.name !== undefined && !String(body.name).trim())
    errors.push({ field: "name", message: MSG.CANNOT_BE_EMPTY("name") });
  return errors.length ? fail(errors) : ok();
}
