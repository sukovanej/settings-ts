import * as E from "fp-ts/Either";
import { Loader } from "../loader";

export const envLoader: Loader<never> = {
  load: () => E.of(process.env),
};
