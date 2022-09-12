import {expectType} from 'tsd';
import { createSettings, Settings, SettingsSpec, TypeFromSettings } from '../../src/settings';
import * as S from '../../src/specs';

const emptySettings = createSettings({});
const urlSettings = createSettings({ v: S.url });

expectType<Settings<{}>>(emptySettings);
expectType<Settings<{v: SettingsSpec<URL>}>>(urlSettings);

expectType<{}>(emptySettings.parseUnsafe({}));
expectType<{ v: URL }>(urlSettings.parseUnsafe({}));

expectType<{}>({} as TypeFromSettings<typeof emptySettings>);
expectType<{ v: URL }>({} as TypeFromSettings<typeof urlSettings>);
