const getAuthMock = (auth) => {
  return {
    data: {
      fields: auth.fields,
      authenticationSteps: auth.authenticationSteps,
      reconnectionSteps: auth.reconnectionSteps,
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getAuthMock;
