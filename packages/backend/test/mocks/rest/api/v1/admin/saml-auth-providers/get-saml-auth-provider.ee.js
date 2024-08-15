const getSamlAuthProviderMock = async (samlAuthProvider) => {
  const data = {
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

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'SamlAuthProvider',
    },
  };
};

export default getSamlAuthProviderMock;
