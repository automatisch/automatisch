const updateCurrentUser = async (_parent, params, context) => {
  const user = await context.currentUser.$query().patchAndFetch({
    email: params.input.email,
    password: params.input.password,
    fullName: params.input.fullName,
  });

  return user;
};

export default updateCurrentUser;
