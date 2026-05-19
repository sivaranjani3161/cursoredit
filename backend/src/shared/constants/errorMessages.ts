export const ERROR_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  CANNOT_BE_EMPTY: (field: string) => `${field} cannot be empty`,
  INVALID_FORMAT: (field: string, format: string) => `${field} must be ${format}`,
  INVALID_ENUM: (field: string, allowedValues: string) => `${field} must be one of: ${allowedValues}`,
  INVALID_ID: (field: string) => `${field} must be a valid id`,
  INVALID_TYPE: (field: string, expectedType: string) => `${field} must be an ${expectedType}`,
  MUST_BE_VALID: (field: string) => `${field} must be valid`,
  SLUG_FORMAT: "lowercase alphanumeric with hyphens",
  EMAIL_FORMAT: "a valid email address",
  ROLE_CODE_FORMAT: "lowercase alphanumeric with underscores",
} as const;
