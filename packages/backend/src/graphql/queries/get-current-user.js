const getCurrentUser = async (_parent, _params, context) => {
  return context.currentUser;
};

export default getCurrentUser;
