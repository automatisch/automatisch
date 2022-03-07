import Context from '../../types/express/context';

type Params = {
  input: {
    email: string;
    password: string;
  };
};

const updateUser = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const user = await context.currentUser.$query().patchAndFetch({
    email: params.input.email,
    password: params.input.password,
  });

  return user;
};

export default updateUser;
