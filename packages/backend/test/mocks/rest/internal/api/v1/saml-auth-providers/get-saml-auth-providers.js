const getSamlAuthProvidersMock = async (samlAuthProviders) => {
  const data = samlAuthProviders.map((samlAuthProvider) => {
    return {
      id: samlAuthProvider.id,
      name: samlAuthProvider.name,
      loginUrl: samlAuthProvider.loginUrl,
      issuer: samlAuthProvider.issuer,
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
