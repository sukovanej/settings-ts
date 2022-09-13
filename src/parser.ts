import * as E from "fp-ts/Either";
import {
  createMissingFieldParseError,
  createValidationError,
  SettingsParseError,
} from "./errors";
import { ValidateResult } from "./validateResult";

export type SettingsInput = Record<string, string | undefined>;

export type TypeOf<T extends SettingsSpecStruct> = {
  [K in keyof T]: ReturnType<T[K]["validate"]> extends ValidateResult<infer R>
    ? R
    : never;
};

export type TypeFromSettings<S extends SettingsParser<SettingsSpecStruct>> =
  S extends SettingsParser<infer T> ? TypeOf<T> : never;

type SettingsParserFn<T extends SettingsSpecStruct> = (
  input: SettingsInput
) => E.Either<SettingsParseError, TypeOf<T>>;

export interface SettingsParser<T extends SettingsSpecStruct> {
  parse: SettingsParserFn<T>;
  parseUnsafe: (input: SettingsInput) => TypeOf<T>;
}

export type SettingsSpec<T = unknown> = {
  validate: (value: string) => ValidateResult<T>;
};

type SettingsSpecStruct = Record<string, SettingsSpec>;

export const createParser = <T extends SettingsSpecStruct>(
  struct: T
): SettingsParser<T> => {
  const parse = createParserFn(struct);

  return {
    parse,
    parseUnsafe: createParseUnsafe(parse),
  };
};

const createParseUnsafe =
  <T extends SettingsSpecStruct>(parse: SettingsParserFn<T>) =>
  (input: SettingsInput): TypeOf<T> => {
    const result = parse(input);

    if (E.isLeft(result)) {
      const error = result.left;
      const errorMessage = `Failed validating field '${error.fieldName}' with error '${error.error}'.`;
      throw new Error(errorMessage);
    }

    return result.right;
  };

const createParserFn =
  <T extends SettingsSpecStruct>(struct: T): SettingsParserFn<T> =>
  (input: SettingsInput) => {
    const result: Record<string, unknown> = {};

    for (const [name, validator] of Object.entries(struct)) {
      const value = input[name];

      if (value === undefined) {
        return E.left(createMissingFieldParseError(name));
      }

      const validationResult = validator.validate(value);

      if (E.isLeft(validationResult)) {
        return E.left(createValidationError(name, validationResult.left));
      }

      result[name] = validationResult.right;
    }

    return E.of(result as TypeOf<T>);
  };
