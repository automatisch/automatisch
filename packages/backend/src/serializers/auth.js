const authSerializer = (auth) => {
  return {
    fields: auth.fields,
    authenticationSteps: auth.authenticationSteps,
    sharedAuthenticationSteps: auth.sharedAuthenticationSteps,
    reconnectionSteps: auth.reconnectionSteps,
    sharedReconnectionSteps: auth.sharedReconnectionSteps,
  };
};

export default authSerializer;
