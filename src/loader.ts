import * as IOE from "fp-ts/IOEither";
import { SettingsInput } from "./parser";

export interface Loader<E> {
  load: IOE.IOEither<E, SettingsInput>;
}
