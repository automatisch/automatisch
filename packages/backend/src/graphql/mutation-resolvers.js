// Converted mutations
import verifyConnection from './mutations/verify-connection.js';
import resetConnection from './mutations/reset-connection.js';
import updateConnection from './mutations/update-connection.js';

const mutationResolvers = {
  resetConnection,
  updateConnection,
  verifyConnection,
};

export default mutationResolvers;
