const getAuthMock = (auth) => {
  return {
    data: {
      fields: auth.fields,
      authenticationSteps: auth.authenticationSteps,
      reconnectionSteps: auth.reconnectionSteps,
      sharedReconnectionSteps: auth.sharedReconnectionSteps,
      sharedAuthenticationSteps: auth.sharedAuthenticationSteps,
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
