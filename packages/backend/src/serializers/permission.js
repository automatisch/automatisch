const permissionSerializer = (permission) => {
  return {
    id: permission.id,
    roleId: permission.roleId,
    action: permission.action,
    subject: permission.subject,
    conditions: permission.conditions,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  };
};

export default permissionSerializer;
