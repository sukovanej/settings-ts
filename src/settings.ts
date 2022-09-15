import * as IOE from "fp-ts/IOEither";
import { pipe } from "fp-ts/function";
import { Loader } from "./loader";
import { createParser, SettingsSpecStruct, TypeOf } from "./parser";
import { SettingsParseError } from "./errors";
import { envLoader } from "./loaders";
import {
  createDotEnvFileLoader,
  DotEnvFileLoaderError,
} from "./loaders/dotEnvFile";

interface Settings<E, S extends SettingsSpecStruct> {
  load: IOE.IOEither<E, TypeOf<S>>;
}

type SettingsConfiguration<E> = {
  loader: Loader<E>;
};

export const createSettings = <E, T extends SettingsSpecStruct>(
  struct: T,
  configuration: SettingsConfiguration<E>
): Settings<SettingsParseError | E, T> => {
  const parser = createParser(struct);
  const load = pipe(configuration.loader.load, IOE.chainEitherKW(parser.parse));

  return { load };
};

export const createEnvSettings = <T extends SettingsSpecStruct>(
  struct: T
): Settings<SettingsParseError, T> =>
  createSettings(struct, { loader: envLoader });

export const createDotEnvFileSettings = <T extends SettingsSpecStruct>(
  fileName: string,
  struct: T
): Settings<SettingsParseError | DotEnvFileLoaderError, T> =>
  createSettings(struct, { loader: createDotEnvFileLoader(fileName) });
