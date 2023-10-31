import Step from '../../src/models/step';
import { createFlow } from './flow';

export const createStep = async (params: Partial<Step> = {}) => {
  params.flowId = params?.flowId || (await createFlow()).id;
  params.type = params?.type || 'action';

  const lastStep = await global.knex
    .table('steps')
    .where('flowId', params.flowId)
    .andWhere('deletedAt', '!=', null)
    .orderBy('createdAt', 'desc')
    .first();

  params.position = params?.position || (lastStep?.position || 0) + 1;
  params.status = params?.status || 'completed';
  params.appKey =
    params?.appKey || (params.type === 'action' ? 'deepl' : 'webhook');

  const [step] = await global.knex.table('steps').insert(params).returning('*');

  return step;
};
