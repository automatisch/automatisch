import actionSerializer from '@/serializers/action.js';
import adminSamlAuthProviderSerializer from '@/serializers/admin-saml-auth-provider.ee.js';
import adminApiTokenFullSerializer from '@/serializers/admin/api-token-full.ee.js';
import adminApiTokenSerializer from '@/serializers/admin/api-token.ee.js';
import adminTemplateSerializer from '@/serializers/admin/template.ee.js';
import adminUserSerializer from '@/serializers/admin/user.js';
import appConfigSerializer from '@/serializers/app-config.js';
import appSerializer from '@/serializers/app.js';
import authSerializer from '@/serializers/auth.js';
import configSerializer from '@/serializers/config.js';
import connectionSerializer from '@/serializers/connection.js';
import executionStepSerializer from '@/serializers/execution-step.js';
import executionSerializer from '@/serializers/execution.js';
import flowSerializer from '@/serializers/flow.js';
import folderSerializer from '@/serializers/folder.js';
import oauthClientSerializer from '@/serializers/oauth-client.js';
import permissionSerializer from '@/serializers/permission.js';
import publicTemplateSerializer from '@/serializers/public-template.ee.js';
import publicUserInvitationSerializer from '@/serializers/public-user-invitation.ee.js';
import samlAuthProviderRoleMappingSerializer from '@/serializers/role-mapping.ee.js';
import roleSerializer from '@/serializers/role.js';
import samlAuthProviderSerializer from '@/serializers/saml-auth-provider.ee.js';
import stepSerializer from '@/serializers/step.js';
import subscriptionSerializer from '@/serializers/subscription.ee.js';
import templateSerializer from '@/serializers/template.ee.js';
import triggerSerializer from '@/serializers/trigger.js';
import userAppSerializer from '@/serializers/user-app.js';
import userSerializer from '@/serializers/user.js';
import formSerializer from '@/serializers/form.ee.js';
import publicFormSerializer from '@/serializers/public-form.ee.js';

const serializers = {
  Action: actionSerializer,
  AdminApiToken: adminApiTokenSerializer,
  AdminApiTokenFull: adminApiTokenFullSerializer,
  AdminSamlAuthProvider: adminSamlAuthProviderSerializer,
  AdminTemplate: adminTemplateSerializer,
  AdminUser: adminUserSerializer,
  Form: formSerializer,
  PublicForm: publicFormSerializer,
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
