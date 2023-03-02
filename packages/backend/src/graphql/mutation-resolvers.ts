import createConnection from './mutations/create-connection';
import generateAuthUrl from './mutations/generate-auth-url';
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
import createUser from './mutations/create-user.ee';
import deleteUser from './mutations/delete-user.ee';
import updateUser from './mutations/update-user';
import forgotPassword from './mutations/forgot-password.ee';
import resetPassword from './mutations/reset-password.ee';
import login from './mutations/login';

const mutationResolvers = {
  createConnection,
  generateAuthUrl,
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
  createUser,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
  login,
};

export default mutationResolvers;
