import { CREATE_CONNECTION } from './create-connection';
import { UPDATE_CONNECTION } from './update-connection';
import { VERIFY_CONNECTION } from './verify-connection';
import { RESET_CONNECTION } from './reset-connection';
import { DELETE_CONNECTION } from './delete-connection';
import { GENERATE_AUTH_URL } from './generate-auth-url';

type Mutations = {
  [key: string]: any;
};

const mutations: Mutations = {
  createConnection: CREATE_CONNECTION,
  updateConnection: UPDATE_CONNECTION,
  verifyConnection: VERIFY_CONNECTION,
  resetConnection: RESET_CONNECTION,
  deleteConnection: DELETE_CONNECTION,
  generateAuthUrl: GENERATE_AUTH_URL,
};

export default mutations;
