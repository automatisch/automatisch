import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';
import User from '../../models/user';

type Params = {
  limit: number;
  offset: number;
};

const getUsers = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('read', 'User');

  const usersQuery = User.query()
    .leftJoinRelated({
      role: true,
    })
    .withGraphFetched({
      role: true,
    })
    .orderBy('full_name', 'asc');

  return paginate(usersQuery, params.limit, params.offset);
};

export default getUsers;
