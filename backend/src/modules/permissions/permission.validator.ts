import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";
export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateUpdatePermissions(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const roleId = Number(body?.roleId);
  if (Number.isNaN(roleId) || roleId <= 0) errors.push({ field: "roleId", message: MSG.REQUIRED("roleId") });
  if (body?.permissions === undefined || typeof body.permissions !== "object" || Array.isArray(body.permissions))
    errors.push({ field: "permissions", message: MSG.INVALID_TYPE("permissions", "object") });
  return errors.length ? fail(errors) : ok();
}
