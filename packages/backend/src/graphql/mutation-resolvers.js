import createAppAuthClient from './mutations/create-app-auth-client.ee.js';
import createAppConfig from './mutations/create-app-config.ee.js';
import createConnection from './mutations/create-connection.js';
import createFlow from './mutations/create-flow.js';
import createRole from './mutations/create-role.ee.js';
import createStep from './mutations/create-step.js';
import createUser from './mutations/create-user.ee.js';
import deleteConnection from './mutations/delete-connection.js';
import deleteCurrentUser from './mutations/delete-current-user.ee.js';
import deleteFlow from './mutations/delete-flow.js';
import deleteRole from './mutations/delete-role.ee.js';
import deleteStep from './mutations/delete-step.js';
import deleteUser from './mutations/delete-user.ee.js';
import duplicateFlow from './mutations/duplicate-flow.js';
import executeFlow from './mutations/execute-flow.js';
import forgotPassword from './mutations/forgot-password.ee.js';
import generateAuthUrl from './mutations/generate-auth-url.js';
import login from './mutations/login.js';
import registerUser from './mutations/register-user.ee.js';
import resetConnection from './mutations/reset-connection.js';
import resetPassword from './mutations/reset-password.ee.js';
import updateAppAuthClient from './mutations/update-app-auth-client.ee.js';
import updateAppConfig from './mutations/update-app-config.ee.js';
import updateConfig from './mutations/update-config.ee.js';
import updateConnection from './mutations/update-connection.js';
import updateCurrentUser from './mutations/update-current-user.js';
import updateFlow from './mutations/update-flow.js';
import updateFlowStatus from './mutations/update-flow-status.js';
import updateRole from './mutations/update-role.ee.js';
import updateStep from './mutations/update-step.js';
import updateUser from './mutations/update-user.ee.js';
import upsertSamlAuthProvider from './mutations/upsert-saml-auth-provider.ee.js';
import upsertSamlAuthProvidersRoleMappings from './mutations/upsert-saml-auth-providers-role-mappings.ee.js';
import verifyConnection from './mutations/verify-connection.js';

const mutationResolvers = {
  createAppAuthClient,
  createAppConfig,
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
  updateAppAuthClient,
  updateAppConfig,
  updateConfig,
  updateConnection,
  updateCurrentUser,
  updateFlow,
  updateFlowStatus,
  updateRole,
  updateStep,
  updateUser,
  upsertSamlAuthProvider,
  upsertSamlAuthProvidersRoleMappings,
  verifyConnection,
};

export default mutationResolvers;
