import Folder from '../../src/models/folder.js';
import { faker } from '@faker-js/faker';
import { createUser } from './user.js';

export const createFolder = async (params = {}) => {
  params.userId = params?.userId || (await createUser()).id;
  params.name = params?.name || faker.lorem.word();

  const folder = await Folder.query().insertAndFetch(params);

  return folder;
};
