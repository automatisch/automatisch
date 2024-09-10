import createConnection from './mutations/create-connection.js';
import createUser from './mutations/create-user.ee.js';
import deleteFlow from './mutations/delete-flow.js';
import duplicateFlow from './mutations/duplicate-flow.js';
import generateAuthUrl from './mutations/generate-auth-url.js';
import registerUser from './mutations/register-user.ee.js';
import resetConnection from './mutations/reset-connection.js';
import updateConnection from './mutations/update-connection.js';
import updateCurrentUser from './mutations/update-current-user.js';
import updateFlowStatus from './mutations/update-flow-status.js';
import updateStep from './mutations/update-step.js';

// Converted mutations
import executeFlow from './mutations/execute-flow.js';
import updateUser from './mutations/update-user.ee.js';
import deleteStep from './mutations/delete-step.js';
import verifyConnection from './mutations/verify-connection.js';
import createFlow from './mutations/create-flow.js';
import deleteCurrentUser from './mutations/delete-current-user.ee.js';

const mutationResolvers = {
  createConnection,
  createFlow,
  createUser,
  deleteCurrentUser,
  deleteFlow,
  deleteStep,
  duplicateFlow,
  executeFlow,
  generateAuthUrl,
  registerUser,
  resetConnection,
  updateConnection,
  updateCurrentUser,
  updateFlowStatus,
  updateStep,
  updateUser,
  verifyConnection,
};

export default mutationResolvers;
