import roleSerializer from './role.js';
import permissionSerializer from './permission.js';
import appConfig from '../config/app.js';

const userSerializer = (user) => {
  let userData = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    fullName: user.fullName,
    roleId: user.roleId,
  };

  if (user.role) {
    userData.role = roleSerializer(user.role);
  }

  if (user.permissions) {
    userData.permissions = user.permissions.map((permission) =>
      permissionSerializer(permission)
    );
  }

  if (appConfig.isCloud && user.trialExpiryDate) {
    userData.trialExpiryDate = user.trialExpiryDate;
  }

  return userData;
};

export default userSerializer;
