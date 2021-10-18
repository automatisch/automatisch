import { CREATE_CONNECTION } from './create-connection';
import { UPDATE_CONNECTION } from './update-connection';
import { DELETE_CONNECTION } from './delete-connection';
import { CREATE_AUTH_LINK } from './create-auth-link';

type Mutations = {
  [key: string]: any,
}

const mutations: Mutations = {
  createConnection: CREATE_CONNECTION,
  updateConnection: UPDATE_CONNECTION,
  deleteConnection: DELETE_CONNECTION,
  createAuthLink: CREATE_AUTH_LINK,
};

export default mutations;
