// Converted mutations
import executeFlow from './mutations/execute-flow.js';
import updateUser from './mutations/update-user.ee.js';
import verifyConnection from './mutations/verify-connection.js';
import updateCurrentUser from './mutations/update-current-user.js';
import generateAuthUrl from './mutations/generate-auth-url.js';
import createConnection from './mutations/create-connection.js';
import resetConnection from './mutations/reset-connection.js';
import updateConnection from './mutations/update-connection.js';

const mutationResolvers = {
  createConnection,
  executeFlow,
  generateAuthUrl,
  resetConnection,
  updateConnection,
  updateCurrentUser,
  updateUser,
  verifyConnection,
};

export default mutationResolvers;
