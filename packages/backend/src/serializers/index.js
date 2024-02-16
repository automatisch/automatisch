import userSerializer from './user.js';
import roleSerializer from './role.js';
import permissionSerializer from './permission.js';

const serializers = {
  User: userSerializer,
  Role: roleSerializer,
  Permission: permissionSerializer,
};

export default serializers;
