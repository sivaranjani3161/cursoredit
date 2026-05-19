import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";
export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateCreateRole(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const name = String(body?.name ?? "").trim();
  const code = String(body?.code ?? "").trim();
  if (!name) errors.push({ field: "name", message: MSG.REQUIRED("name") });
  if (!code) errors.push({ field: "code", message: MSG.REQUIRED("code") });
  else if (!/^[a-z0-9_]+$/.test(code))
    errors.push({ field: "code", message: MSG.INVALID_FORMAT("code", MSG.ROLE_CODE_FORMAT) });
  return errors.length ? fail(errors) : ok();
}
