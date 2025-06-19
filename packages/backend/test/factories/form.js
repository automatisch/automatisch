import Form from '@/models/form.ee.js';
import { faker } from '@faker-js/faker';
import { createUser } from '@/factories/user.js';

export const createForm = async (params = {}) => {
  params.userId = params?.userId || (await createUser()).id;
  params.name = params?.name || faker.lorem.word();

  const form = await Form.query().insertAndFetch(params);

  return form;
};
