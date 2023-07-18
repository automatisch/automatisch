import Context from '../../types/express/context';
import User from '../../models/user';

type Params = {
  id: string
};

const getUser = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('read', 'User');

  return await User
    .query()
    .leftJoinRelated({
      role: true
    })
    .withGraphFetched({
      role: true
    })
    .findById(params.id)
    .throwIfNotFound();
};

export default getUser;
