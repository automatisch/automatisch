import { IJSONObject } from '@automatisch/types';
import set from 'lodash/set';

export default function nestObject<T = IJSONObject>(
  config: IJSONObject | undefined
): Partial<T> {
  if (!config) return {};
  const result = {};

  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      const value = config[key];
      set(result, key, value);
    }
  }

  return result;
}
