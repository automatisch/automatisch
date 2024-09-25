import { UPDATE_CONNECTION } from './update-connection';
import { VERIFY_CONNECTION } from './verify-connection';
import { RESET_CONNECTION } from './reset-connection';
import { GENERATE_AUTH_URL } from './generate-auth-url';

const mutations = {
  updateConnection: UPDATE_CONNECTION,
  verifyConnection: VERIFY_CONNECTION,
  resetConnection: RESET_CONNECTION,
  generateAuthUrl: GENERATE_AUTH_URL,
};
export default mutations;
