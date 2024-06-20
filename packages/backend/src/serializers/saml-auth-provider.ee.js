const samlAuthProviderSerializer = (samlAuthProvider) => {
  return {
    id: samlAuthProvider.id,
    name: samlAuthProvider.name,
    loginUrl: samlAuthProvider.loginUrl,
    issuer: samlAuthProvider.issuer,
  };
};

export default samlAuthProviderSerializer;
