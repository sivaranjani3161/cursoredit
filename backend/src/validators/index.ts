import { BlogStatus } from "../entities/enums/BlogStatus";
import { ERROR_MESSAGES as MSG } from "../constants/errorMessages";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function ok(): ValidationResult {
  return { valid: true, errors: [] };
}

function fail(errors: ValidationError[]): ValidationResult {
  return { valid: false, errors };
}

// ── Blog ───────────────────────────────────────────────────────────────────

export function validateCreateBlog(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  const title = String(body?.title ?? "").trim();
  const slug = String(body?.slug ?? "").trim();
  const createdBy = Number(body?.createdBy);

  if (!title) errors.push({ field: "title", message: MSG.REQUIRED("title") });
  if (!slug) errors.push({ field: "slug", message: MSG.REQUIRED("slug") });
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
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

// ── Course ─────────────────────────────────────────────────────────────────

export function validateCreateCourse(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  const title = String(body?.title ?? "").trim();
  const slug = String(body?.slug ?? "").trim();
  const createdBy = Number(body?.createdBy);

  if (!title) errors.push({ field: "title", message: MSG.REQUIRED("title") });
  if (!slug) errors.push({ field: "slug", message: MSG.REQUIRED("slug") });
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

// ── CourseCategory ─────────────────────────────────────────────────────────

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

// ── Enquiry ────────────────────────────────────────────────────────────────

export function validateCreateEnquiry(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  const fullName = String(body?.fullName ?? "").trim();
  const email = String(body?.email ?? "").trim();

  if (!fullName) errors.push({ field: "fullName", message: MSG.REQUIRED("fullName") });
  if (!email) errors.push({ field: "email", message: MSG.REQUIRED("email") });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push({ field: "email", message: MSG.INVALID_FORMAT("email", MSG.EMAIL_FORMAT) });

  return errors.length ? fail(errors) : ok();
}

export function validateUpdateEnquiry(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (body?.email !== undefined) {
    const email = String(body.email).trim();
    if (!email) errors.push({ field: "email", message: MSG.CANNOT_BE_EMPTY("email") });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push({ field: "email", message: MSG.INVALID_FORMAT("email", MSG.EMAIL_FORMAT) });
  }

  return errors.length ? fail(errors) : ok();
}

// ── Testimonial ────────────────────────────────────────────────────────────

export function validateCreateTestimonial(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  const createdBy = Number(body?.createdBy);
  if (Number.isNaN(createdBy) || createdBy <= 0)
    errors.push({ field: "createdBy", message: MSG.INVALID_ID("createdBy") });

  return errors.length ? fail(errors) : ok();
}

// ── Gallery ────────────────────────────────────────────────────────────────

export function validateCreateGallery(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const type = body?.type;

  if (type !== "internal" && type !== "external")
    errors.push({ field: "type", message: MSG.INVALID_ENUM("type", '"internal", "external"') });

  if (type === "external") {
    const title = String(body?.title ?? "").trim();
    const slug = String(body?.slug ?? "").trim();
    const createdBy = Number(body?.createdBy);

    if (!title) errors.push({ field: "title", message: MSG.REQUIRED("title") });
    if (!slug) errors.push({ field: "slug", message: MSG.REQUIRED("slug") });
    if (Number.isNaN(createdBy) || createdBy <= 0)
      errors.push({ field: "createdBy", message: MSG.REQUIRED("createdBy") });
  }

  if (type === "internal") {
    const imageUrl = String(body?.imageUrl ?? "").trim();
    if (!imageUrl) errors.push({ field: "imageUrl", message: MSG.REQUIRED("imageUrl") });
  }

  return errors.length ? fail(errors) : ok();
}

// ── User ───────────────────────────────────────────────────────────────────

export function validateCreateUser(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  const email = String(body?.email ?? "").trim();
  const name = String(body?.name ?? "").trim();
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

// ── Role ───────────────────────────────────────────────────────────────────

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

// ── Permissions ────────────────────────────────────────────────────────────

export function validateUpdatePermissions(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  const roleId = Number(body?.roleId);
  if (Number.isNaN(roleId) || roleId <= 0)
    errors.push({ field: "roleId", message: MSG.REQUIRED("roleId") });

  if (body?.permissions === undefined || typeof body.permissions !== "object" || Array.isArray(body.permissions))
    errors.push({ field: "permissions", message: MSG.INVALID_TYPE("permissions", "object") });

  return errors.length ? fail(errors) : ok();
}
