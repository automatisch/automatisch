import Context from '../../types/express/context';

const getCurrentUser = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  return context.currentUser;
};

export default getCurrentUser;
