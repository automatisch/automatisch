const getSamlAuthProvidersMock = async (samlAuthProviders) => {
  const data = samlAuthProviders.map((samlAuthProvider) => {
    return {
      active: samlAuthProvider.active,
      certificate: samlAuthProvider.certificate,
      defaultRoleId: samlAuthProvider.defaultRoleId,
      emailAttributeName: samlAuthProvider.emailAttributeName,
      entryPoint: samlAuthProvider.entryPoint,
      firstnameAttributeName: samlAuthProvider.firstnameAttributeName,
      id: samlAuthProvider.id,
      issuer: samlAuthProvider.issuer,
      name: samlAuthProvider.name,
      roleAttributeName: samlAuthProvider.roleAttributeName,
      signatureAlgorithm: samlAuthProvider.signatureAlgorithm,
      surnameAttributeName: samlAuthProvider.surnameAttributeName,
    };
  });

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'SamlAuthProvider',
    },
  };
};

export default getSamlAuthProvidersMock;
