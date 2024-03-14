const roleMappingSerializer = (roleMapping) => {
  return {
    id: roleMapping.id,
    samlAuthProviderId: roleMapping.samlAuthProviderId,
    roleId: roleMapping.roleId,
    remoteRoleName: roleMapping.remoteRoleName,
  };
};

export default roleMappingSerializer;
