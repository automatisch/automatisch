import Flow from '../../src/models/flow';
import { createUser } from './user';

export const createFlow = async (params: Partial<Flow> = {}) => {
  params.userId = params?.userId || (await createUser()).id;
  params.name = params?.name || 'Name your flow!';

  const [flow] = await global.knex.table('flows').insert(params).returning('*');

  return flow;
};
