import Folder from '../../src/models/folder.js';
import { faker } from '@faker-js/faker';

export const createFolder = async (params = {}) => {
  params.name = params?.name || faker.lorem.word();

  const folder = await Folder.query().insertAndFetch(params);

  return folder;
};
