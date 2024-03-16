import permissionSerializer from './permission.js';

const roleSerializer = (role) => {
  let roleData = {
    id: role.id,
    name: role.name,
    key: role.key,
    description: role.description,
    createdAt: role.createdAt.getTime(),
    updatedAt: role.updatedAt.getTime(),
    isAdmin: role.isAdmin,
  };

  if (role.permissions?.length > 0) {
    roleData.permissions = role.permissions.map((permission) =>
      permissionSerializer(permission)
    );
  }

  return roleData;
};

export default roleSerializer;
