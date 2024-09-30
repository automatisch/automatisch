// Converted mutations
import verifyConnection from './mutations/verify-connection.js';
import generateAuthUrl from './mutations/generate-auth-url.js';
import resetConnection from './mutations/reset-connection.js';
import updateConnection from './mutations/update-connection.js';

const mutationResolvers = {
  generateAuthUrl,
  resetConnection,
  updateConnection,
  verifyConnection,
};

export default mutationResolvers;
