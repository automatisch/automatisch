import Context from '../../types/express/context';
import Config from '../../models/config';

type Params = {
  keys: string[];
};

const getConfig = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const configQuery = Config
    .query();

  if (Array.isArray(params.keys)) {
    configQuery.whereIn('key', params.keys);
  }

  const config = await configQuery;

  return config.reduce((computedConfig, configEntry) => {
    const { key, value } = configEntry;

    computedConfig[key] = value?.data;

    return computedConfig;
  }, {} as Record<string, unknown>);
};

export default getConfig;
