import Context from '../../types/express/context';
import AppAuthClient from '../../models/app-auth-client';

type Params = {
  input: {
    id: string;
  };
};

const deleteAppAuthClient = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('delete', 'App');

  await AppAuthClient
    .query()
    .delete()
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  return;
};

export default deleteAppAuthClient;
