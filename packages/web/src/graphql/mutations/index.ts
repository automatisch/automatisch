import { CREATE_CONNECTION } from './create-connection';
import { CREATE_AUTH_LINK } from './create-auth-link';
import { UPDATE_CONNECTION } from './update-connection';

type Mutations = {
  [key: string]: any,
}

const mutations: Mutations = {
  createConnection: CREATE_CONNECTION,
  updateConnection: UPDATE_CONNECTION,
  createAuthLink: CREATE_AUTH_LINK,
};

export default mutations;
