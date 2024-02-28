const authSerializer = (auth) => {
  return {
    fields: auth.fields,
    authenticationSteps: auth.authenticationSteps,
    reconnectionSteps: auth.reconnectionSteps,
  };
};

export default authSerializer;
