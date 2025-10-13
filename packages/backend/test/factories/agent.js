import { faker } from '@faker-js/faker';
import Agent from '@/models/agent.ee.js';
import { createUser } from '@/factories/user.js';

export const createAgent = async (params = {}) => {
  params.userId = params.userId || (await createUser()).id;
  params.name = params.name || faker.person.fullName();
  params.description = params.description || faker.lorem.sentence();
  params.instructions = params.instructions || faker.lorem.paragraph();

  const agent = await Agent.query().insertAndFetch(params);

  return agent;
};
