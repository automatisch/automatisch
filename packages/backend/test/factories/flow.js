import Flow from '../../src/models/flow.js';
import { createUser } from './user.js';

export const createFlow = async (params = {}) => {
  params.userId = params?.userId || (await createUser()).id;
  params.name = params?.name || 'Name your flow!';
  params.createdAt = params?.createdAt || new Date().toISOString();
  params.updatedAt = params?.updatedAt || new Date().toISOString();

  const flow = await Flow.query().insertAndFetch(params);

  return flow;
};
