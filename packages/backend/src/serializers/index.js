import userSerializer from './user.js';
import roleSerializer from './role.js';
import permissionSerializer from './permission.js';
import samlAuthProviderSerializer from './saml-auth-provider.ee.js';
import appAuthClientSerializer from './app-auth-client.js';
import flowSerializer from './flow.js';
import stepSerializer from './step.js';
import appSerializer from './app.js';
import authSerializer from './auth.js';
import triggerSerializer from './trigger.js';
import actionSerializer from './action.js';
import executionSerializer from './execution.js';

const serializers = {
  User: userSerializer,
  Role: roleSerializer,
  Permission: permissionSerializer,
  SamlAuthProvider: samlAuthProviderSerializer,
  AppAuthClient: appAuthClientSerializer,
  Flow: flowSerializer,
  Step: stepSerializer,
  App: appSerializer,
  Auth: authSerializer,
  Trigger: triggerSerializer,
  Action: actionSerializer,
  Execution: executionSerializer,
};

export default serializers;
