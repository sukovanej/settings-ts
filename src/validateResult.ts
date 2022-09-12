import * as E from "fp-ts/Either";

export type ValidateResult<T> = E.Either<string, T>;

export const successResult = <T>(result: T): ValidateResult<T> => E.of(result);

export const errorResult = <T>(result: string): ValidateResult<T> =>
  E.left(result);
