import { SettingsSpec } from "./settings";
import { compose } from "./specCombinators";
import { Integer, IntegerRange, PositiveInteger } from "./types";
import { errorResult, successResult } from "./validateResult";

export const string: SettingsSpec<string> = {
  type: "string-spec",
  validate: (s) => successResult(s),
};

export const EMPTY_STRING_ERROR_DESCRIPTION = "Value length must be non-zero.";

export const nonEmptyString: SettingsSpec<string> = {
  type: "non-empty-string-spec",
  validate: (s) =>
    s.length > 0
      ? successResult(s)
      : errorResult(EMPTY_STRING_ERROR_DESCRIPTION),
};

export const url: SettingsSpec<URL> = {
  type: "url-spec",
  validate: (s) => {
    try {
      return successResult(new URL(s));
    } catch {
      return errorResult(`Value '${s}' is not a valid URL.`);
    }
  },
};

export const number: SettingsSpec<number> = {
  type: "url-spec",
  validate: (s) => {
    if (!/^-?\d+(\.\d+)?$/.test(s)) {
      return errorResult("Expected number.");
    }

    return successResult(parseFloat(s));
  },
};

export const integer: SettingsSpec<Integer> = compose<number, Integer>((n) =>
  Number.isInteger(n)
    ? successResult(n as Integer)
    : errorResult("Expected integer.")
)(number);

export const positiveInteger: SettingsSpec<PositiveInteger> = compose<
  Integer,
  PositiveInteger
>((n) =>
  n > 0
    ? successResult(n as PositiveInteger)
    : errorResult("Expected positive integer.")
)(integer);

export const integerRange = <L extends number, U extends number>(
  lowerBound: L,
  upperBound: U
): SettingsSpec<IntegerRange<L, U>> =>
  compose<Integer, IntegerRange<L, U>>((n) =>
    n >= lowerBound && n <= upperBound
      ? successResult(n as IntegerRange<L, U>)
      : errorResult(`Expected integer in range ${lowerBound}-${upperBound}.`)
  )(integer);
