import roleSerializer from './role.js';
import permissionSerializer from './permission.js';
import appConfig from '../config/app.js';

const userSerializer = (user) => {
  let userData = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
    status: user.status,
    fullName: user.fullName,
  };

  if (user.role) {
    userData.role = roleSerializer(user.role);
  }

  if (user.permissions?.length > 0) {
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
