import { DateTime } from 'luxon';
import { createUser } from './user';
import UsageData from '../../src/models/usage-data.ee.js';

export const createUsageData = async (params = {}) => {
  params.userId = params?.userId || (await createUser()).id;
  params.nextResetAt =
    params?.nextResetAt || DateTime.now().plus({ days: 30 }).toISODate();

  params.consumedTaskCount = params?.consumedTaskCount || 0;

  const usageData = await UsageData.query().insertAndFetch(params);

  return usageData;
};
