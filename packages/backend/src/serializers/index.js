import userSerializer from './user.js';
import roleSerializer from './role.js';
import permissionSerializer from './permission.js';
import adminSamlAuthProviderSerializer from './admin-saml-auth-provider.ee.js';
import samlAuthProviderSerializer from './saml-auth-provider.ee.js';
import samlAuthProviderRoleMappingSerializer from './role-mapping.ee.js';
import appAuthClientSerializer from './app-auth-client.js';
import appConfigSerializer from './app-config.js';
import flowSerializer from './flow.js';
import stepSerializer from './step.js';
import connectionSerializer from './connection.js';
import appSerializer from './app.js';
import authSerializer from './auth.js';
import triggerSerializer from './trigger.js';
import actionSerializer from './action.js';
import executionSerializer from './execution.js';
import executionStepSerializer from './execution-step.js';
import subscriptionSerializer from './subscription.ee.js';

const serializers = {
  User: userSerializer,
  Role: roleSerializer,
  Permission: permissionSerializer,
  AdminSamlAuthProvider: adminSamlAuthProviderSerializer,
  SamlAuthProvider: samlAuthProviderSerializer,
  SamlAuthProvidersRoleMapping: samlAuthProviderRoleMappingSerializer,
  AppAuthClient: appAuthClientSerializer,
  AppConfig: appConfigSerializer,
  Flow: flowSerializer,
  Step: stepSerializer,
  Connection: connectionSerializer,
  App: appSerializer,
  Auth: authSerializer,
  Trigger: triggerSerializer,
  Action: actionSerializer,
  Execution: executionSerializer,
  ExecutionStep: executionStepSerializer,
  Subscription: subscriptionSerializer,
};

export default serializers;
