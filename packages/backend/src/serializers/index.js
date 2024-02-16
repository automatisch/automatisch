import userSerializer from './user.js';
import roleSerializer from './role.js';
import permissionSerializer from './permission.js';
import samlAuthProviderSerializer from './saml-auth-provider.ee.js';
import appAuthClientSerializer from './appAuthClientSerializer.js';

const serializers = {
  User: userSerializer,
  Role: roleSerializer,
  Permission: permissionSerializer,
  SamlAuthProvider: samlAuthProviderSerializer,
  AppAuthClient: appAuthClientSerializer,
};

export default serializers;
