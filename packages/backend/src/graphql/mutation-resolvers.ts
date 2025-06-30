import createConnection from './mutations/create-connection';
import createFlow from './mutations/create-flow';
import createRole from './mutations/create-role.ee';
import createStep from './mutations/create-step';
import createUser from './mutations/create-user.ee';
import deleteConnection from './mutations/delete-connection';
import deleteCurrentUser from './mutations/delete-current-user.ee';
import deleteFlow from './mutations/delete-flow';
import deleteRole from './mutations/delete-role.ee';
import deleteStep from './mutations/delete-step';
import deleteUser from './mutations/delete-user.ee';
import duplicateFlow from './mutations/duplicate-flow';
import executeFlow from './mutations/execute-flow';
import forgotPassword from './mutations/forgot-password.ee';
import generateAuthUrl from './mutations/generate-auth-url';
import login from './mutations/login';
import registerUser from './mutations/register-user.ee';
import resetConnection from './mutations/reset-connection';
import resetPassword from './mutations/reset-password.ee';
import updateConnection from './mutations/update-connection';
import updateCurrentUser from './mutations/update-current-user';
import updateFlow from './mutations/update-flow';
import updateFlowStatus from './mutations/update-flow-status';
import updateRole from './mutations/update-role.ee';
import updateStep from './mutations/update-step';
import updateUser from './mutations/update-user.ee';
import verifyConnection from './mutations/verify-connection';

const mutationResolvers = {
  createConnection,
  createFlow,
  createRole,
  createStep,
  createUser,
  deleteConnection,
  deleteCurrentUser,
  deleteFlow,
  deleteRole,
  deleteStep,
  deleteUser,
  duplicateFlow,
  executeFlow,
  forgotPassword,
  generateAuthUrl,
  login,
  registerUser,
  resetConnection,
  resetPassword,
  updateConnection,
  updateCurrentUser,
  updateUser,
  updateFlow,
  updateFlowStatus,
  updateRole,
  updateStep,
  verifyConnection,
};

export default mutationResolvers;
