import createConnection from './mutations/create-connection';
import createAuthData from './mutations/create-auth-data';
import updateConnection from './mutations/update-connection';
import resetConnection from './mutations/reset-connection';
import verifyConnection from './mutations/verify-connection';
import deleteConnection from './mutations/delete-connection';
import createFlow from './mutations/create-flow';
import updateFlow from './mutations/update-flow';
import updateFlowStatus from './mutations/update-flow-status';
import executeFlow from './mutations/execute-flow';
import deleteFlow from './mutations/delete-flow';
import createStep from './mutations/create-step';
import updateStep from './mutations/update-step';
import deleteStep from './mutations/delete-step';
import login from './mutations/login';

const mutationResolvers = {
  createConnection,
  createAuthData,
  updateConnection,
  resetConnection,
  verifyConnection,
  deleteConnection,
  createFlow,
  updateFlow,
  updateFlowStatus,
  executeFlow,
  deleteFlow,
  createStep,
  updateStep,
  deleteStep,
  login,
};

export default mutationResolvers;
