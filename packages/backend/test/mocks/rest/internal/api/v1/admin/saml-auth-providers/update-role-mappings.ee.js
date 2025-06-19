const createRoleMappingsMock = async (roleMappings) => {
  const data = roleMappings.map((roleMapping) => {
    return {
      id: roleMapping.id,
      samlAuthProviderId: roleMapping.samlAuthProviderId,
      roleId: roleMapping.roleId,
      remoteRoleName: roleMapping.remoteRoleName,
    };
  });

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'RoleMapping',
    },
  };
};

export default createRoleMappingsMock;
