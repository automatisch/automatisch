const adminSamlAuthProviderSerializer = (samlAuthProvider) => {
  return {
    id: samlAuthProvider.id,
    name: samlAuthProvider.name,
    certificate: samlAuthProvider.certificate,
    signatureAlgorithm: samlAuthProvider.signatureAlgorithm,
    issuer: samlAuthProvider.issuer,
    entryPoint: samlAuthProvider.entryPoint,
    firstnameAttributeName: samlAuthProvider.firstnameAttributeName,
    surnameAttributeName: samlAuthProvider.surnameAttributeName,
    emailAttributeName: samlAuthProvider.emailAttributeName,
    roleAttributeName: samlAuthProvider.roleAttributeName,
    active: samlAuthProvider.active,
    defaultRoleId: samlAuthProvider.defaultRoleId,
  };
};

export default adminSamlAuthProviderSerializer;
