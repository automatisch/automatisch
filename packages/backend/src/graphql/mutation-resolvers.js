// Converted mutations
import verifyConnection from './mutations/verify-connection.js';
import updateCurrentUser from './mutations/update-current-user.js';
import resetConnection from './mutations/reset-connection.js';

const mutationResolvers = {
  resetConnection,
  updateCurrentUser,
  verifyConnection,
};

export default mutationResolvers;
