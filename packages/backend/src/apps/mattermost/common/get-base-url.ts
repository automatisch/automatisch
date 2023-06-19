import { IGlobalVariable } from '@automatisch/types';

const getBaseUrl = ($: IGlobalVariable): string => {
  return $.auth.data.instanceUrl as string;
};

export default getBaseUrl;
