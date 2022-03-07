import Context from '../../types/express/context';

type Params = {
  email: string;
  password: string;
};

const updateUser = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const user = await context.currentUser.$query().patchAndFetch({
    email: params.email,
    password: params.password,
  });

  return user;
};

export default updateUser;
