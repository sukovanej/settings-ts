import * as IO from 'fp-ts/IO';
import { SettingsInput } from './parser';

export interface Loader {
  load: IO.IO<SettingsInput>;
}
