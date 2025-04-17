import actionSerializer from './action.js';
import adminSamlAuthProviderSerializer from './admin-saml-auth-provider.ee.js';
import adminApiTokenFullSerializer from './admin/api-token-full.ee.js';
import adminApiTokenSerializer from './admin/api-token.ee.js';
import adminTemplateSerializer from './admin/template.ee.js';
import adminUserSerializer from './admin/user.js';
import appConfigSerializer from './app-config.js';
import appSerializer from './app.js';
import authSerializer from './auth.js';
import configSerializer from './config.js';
import connectionSerializer from './connection.js';
import executionStepSerializer from './execution-step.js';
import executionSerializer from './execution.js';
import flowSerializer from './flow.js';
import folderSerializer from './folder.js';
import oauthClientSerializer from './oauth-client.js';
import permissionSerializer from './permission.js';
import publicTemplateSerializer from './public-template.ee.js';
import publicUserInvitationSerializer from './public-user-invitation.ee.js';
import samlAuthProviderRoleMappingSerializer from './role-mapping.ee.js';
import roleSerializer from './role.js';
import samlAuthProviderSerializer from './saml-auth-provider.ee.js';
import stepSerializer from './step.js';
import subscriptionSerializer from './subscription.ee.js';
import templateSerializer from './template.ee.js';
import triggerSerializer from './trigger.js';
import userAppSerializer from './user-app.js';
import userSerializer from './user.js';
import formSerializer from './form.ee.js';

const serializers = {
  Action: actionSerializer,
  AdminApiToken: adminApiTokenSerializer,
  AdminApiTokenFull: adminApiTokenFullSerializer,
  AdminSamlAuthProvider: adminSamlAuthProviderSerializer,
  AdminTemplate: adminTemplateSerializer,
  AdminUser: adminUserSerializer,
  Form: formSerializer,
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
  PublicTemplate: publicTemplateSerializer,
  PublicUserInvitation: publicUserInvitationSerializer,
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
