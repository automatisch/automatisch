import permissionSerializer from './permission';

const roleSerializer = (role) => {
  let roleData = {
    id: role.id,
    name: role.name,
    key: role.key,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    isAdmin: role.isAdmin,
  };

  if (role.permissions) {
    roleData.permissions = role.permissions.map((permission) =>
      permissionSerializer(permission)
    );
  }

  return roleData;
};

export default roleSerializer;
