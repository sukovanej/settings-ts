import {
  errorValidateResult,
  SettingsSpec,
  successValidateResult,
} from "./settings";

export const string: SettingsSpec<string> = {
  type: "string-spec",
  validate: (s) => successValidateResult(s),
};

export const EMPTY_STRING_ERROR_DESCRIPTION = "Value length must be non-zero.";

export const nonEmptyString: SettingsSpec<string> = {
  type: "non-empty-string-spec",
  validate: (s) =>
    s.length > 0
      ? successValidateResult(s)
      : errorValidateResult(EMPTY_STRING_ERROR_DESCRIPTION),
};

export const url: SettingsSpec<URL> = {
  type: "url-spec",
  validate: (s) => {
    try {
      return successValidateResult(new URL(s));
    } catch {
      return errorValidateResult(`Value '${s}' is not a valid URL.`);
    }
  },
};
