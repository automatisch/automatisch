import { IGlobalVariable } from '@automatisch/types';

const getInstanceUrl = ($: IGlobalVariable): string => {
  return $.auth.data.instanceUrl as string;
};

export default getInstanceUrl;
