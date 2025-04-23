import userSerializer from './user.js';
import roleSerializer from './role.js';
import permissionSerializer from './permission.js';
import adminSamlAuthProviderSerializer from './admin-saml-auth-provider.ee.js';
import adminTemplateSerializer from './admin/template.ee.js';
import adminApiTokenSerializer from './admin/api-token.ee.js';
import adminApiTokenFullSerializer from './admin/api-token-full.ee.js';
import templateSerializer from './template.ee.js';
import samlAuthProviderSerializer from './saml-auth-provider.ee.js';
import samlAuthProviderRoleMappingSerializer from './role-mapping.ee.js';
import oauthClientSerializer from './oauth-client.js';
import appConfigSerializer from './app-config.js';
import flowSerializer from './flow.js';
import stepSerializer from './step.js';
import connectionSerializer from './connection.js';
import appSerializer from './app.js';
import userAppSerializer from './user-app.js';
import authSerializer from './auth.js';
import triggerSerializer from './trigger.js';
import actionSerializer from './action.js';
import executionSerializer from './execution.js';
import executionStepSerializer from './execution-step.js';
import subscriptionSerializer from './subscription.ee.js';
import adminUserSerializer from './admin/user.js';
import configSerializer from './config.js';
import folderSerializer from './folder.js';

const serializers = {
  Action: actionSerializer,
  AdminApiToken: adminApiTokenSerializer,
  AdminApiTokenFull: adminApiTokenFullSerializer,
  AdminSamlAuthProvider: adminSamlAuthProviderSerializer,
  AdminTemplate: adminTemplateSerializer,
  AdminUser: adminUserSerializer,
  App: appSerializer,
  AppConfig: appConfigSerializer,
  Auth: authSerializer,
  Config: configSerializer,
  Connection: connectionSerializer,
  Execution: executionSerializer,
  ExecutionStep: executionStepSerializer,
  Flow: flowSerializer,
  Folder: folderSerializer,
  OAuthClient: oauthClientSerializer,
  Permission: permissionSerializer,
  Role: roleSerializer,
  RoleMapping: samlAuthProviderRoleMappingSerializer,
  SamlAuthProvider: samlAuthProviderSerializer,
  Step: stepSerializer,
  Subscription: subscriptionSerializer,
  Template: templateSerializer,
  Trigger: triggerSerializer,
  User: userSerializer,
  UserApp: userAppSerializer,
};

export default serializers;
