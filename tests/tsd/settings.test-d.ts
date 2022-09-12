import { expectType } from "tsd";
import {
  createSettings,
  Settings,
  SettingsSpec,
  TypeFromSettings,
} from "../../src/settings";
import * as S from "../../src/specs";

const urlSettings = createSettings({ v: S.url });

expectType<Settings<{ v: SettingsSpec<URL> }>>(urlSettings);

expectType<{ v: URL }>(urlSettings.parseUnsafe({}));

expectType<{ v: URL }>({} as TypeFromSettings<typeof urlSettings>);
