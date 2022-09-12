import * as E from "fp-ts/Either";
import {
  createMissingFieldParseError,
  createValidationError,
  SettingsParseError,
} from "./errors";

type SettingsInput = Record<string, string>;

export type TypeOf<T extends SettingsSpecStruct> =
  { [K in keyof T]: ReturnType<T[K]['validate']> extends SettingsValidateResult<infer K> ? K : never};

export type TypeFromSettings<S extends Settings<{}>> =
  S extends Settings<infer T> ? TypeOf<T> : never;

type SettingsParserFn<T extends SettingsSpecStruct> = (
  input: SettingsInput
) => E.Either<SettingsParseError, TypeOf<T>>;

export interface Settings<T extends SettingsSpecStruct> {
  parse: SettingsParserFn<T>;
  parseUnsafe: (input: SettingsInput) => TypeOf<T>;
}

export type SettingsValidateResult<T> = E.Either<string, T>;

export const successValidateResult = <T>(
  result: T
): SettingsValidateResult<T> => E.of(result);

export const errorValidateResult = <T>(
  result: string
): SettingsValidateResult<T> => E.left(result);

export type SettingsSpec<T = unknown> = {
  type: string;
  validate: (value: string) => SettingsValidateResult<T>;
};

type SettingsSpecStruct = Record<string, SettingsSpec>;

export const createSettings = <T extends SettingsSpecStruct>(
  struct: T
): Settings<T> => {
  const parse = createParser(struct);

  return {
    parse,
    parseUnsafe: createParseUnsafe(parse)
  };
};

const createParseUnsafe = <T extends SettingsSpecStruct>(parse: SettingsParserFn<T>) =>
  (input: SettingsInput): TypeOf<T> => {
    const result = parse(input);
    if (E.isLeft(result)) {
      throw result.left;
    }

    return result.right;
  }

const createParser =
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
