import * as E from "fp-ts/Either";
import { SettingsSpec } from "./parser";
import { ValidateResult } from "./validateResult";

export const compose =
  <A, B>(validate: (a: A) => ValidateResult<B>) =>
  (spec: SettingsSpec<A>): SettingsSpec<B> => ({
    validate: (s) => E.chain(validate)(spec.validate(s)),
  });
