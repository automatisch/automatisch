import createConnection from './mutations/create-connection.js';
import createRole from './mutations/create-role.ee.js';
import createStep from './mutations/create-step.js';
import createUser from './mutations/create-user.ee.js';
import deleteCurrentUser from './mutations/delete-current-user.ee.js';
import deleteFlow from './mutations/delete-flow.js';
import deleteRole from './mutations/delete-role.ee.js';
import duplicateFlow from './mutations/duplicate-flow.js';
import executeFlow from './mutations/execute-flow.js';
import generateAuthUrl from './mutations/generate-auth-url.js';
import registerUser from './mutations/register-user.ee.js';
import resetConnection from './mutations/reset-connection.js';
import updateConnection from './mutations/update-connection.js';
import updateCurrentUser from './mutations/update-current-user.js';
import updateFlowStatus from './mutations/update-flow-status.js';
import updateRole from './mutations/update-role.ee.js';
import updateStep from './mutations/update-step.js';
import upsertSamlAuthProvider from './mutations/upsert-saml-auth-provider.ee.js';
import upsertSamlAuthProvidersRoleMappings from './mutations/upsert-saml-auth-providers-role-mappings.ee.js';

// Converted mutations
import updateUser from './mutations/update-user.ee.js';
import deleteStep from './mutations/delete-step.js';
import verifyConnection from './mutations/verify-connection.js';
import createFlow from './mutations/create-flow.js';

const mutationResolvers = {
  createConnection,
  createFlow,
  createRole,
  createStep,
  createUser,
  deleteCurrentUser,
  deleteFlow,
  deleteRole,
  deleteStep,
  duplicateFlow,
  executeFlow,
  generateAuthUrl,
  registerUser,
  resetConnection,
  updateConnection,
  updateCurrentUser,
  updateFlowStatus,
  updateRole,
  updateStep,
  updateUser,
  upsertSamlAuthProvider,
  upsertSamlAuthProvidersRoleMappings,
  verifyConnection,
};

export default mutationResolvers;
