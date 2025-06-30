import Context from '../../types/express/context';

type Params = {
  input: {
    email: string;
    password: string;
    fullName: string;
  };
};

const updateCurrentUser = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const user = await context.currentUser.$query().patchAndFetch({
    email: params.input.email,
    password: params.input.password,
    fullName: params.input.fullName,
  });

  return user;
};

export default updateCurrentUser;
