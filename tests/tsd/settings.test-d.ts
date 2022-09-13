import { expectType } from "tsd";
import {
  createParser,
  SettingsParser,
  SettingsSpec,
  TypeFromSettings,
} from "../../src/parser";
import * as S from "../../src/specs";

const urlSettings = createParser({ v: S.url });

expectType<SettingsParser<{ v: SettingsSpec<URL> }>>(urlSettings);

expectType<{ v: URL }>(urlSettings.parseUnsafe({}));

expectType<{ v: URL }>({} as TypeFromSettings<typeof urlSettings>);
