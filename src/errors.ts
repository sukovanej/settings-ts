export type MissingFieldParseError = {
  error: "missing-field";
  fieldName: string;
};

export const createMissingFieldParseError = (
  fieldName: string
): MissingFieldParseError => ({
  error: "missing-field",
  fieldName,
});

export type ValidationError = {
  error: "validation";
  fieldName: string;
  description: string;
};

export const createValidationError = (
  fieldName: string,
  description: string
): ValidationError => ({
  error: "validation",
  fieldName,
  description,
});

export type SettingsParseError = MissingFieldParseError | ValidationError;
