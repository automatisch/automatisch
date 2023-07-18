import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';
import User from '../../models/user';

type Params = {
  limit: number;
  offset: number;
};

// TODO: access
const getUsers = async (_parent: unknown, params: Params, context: Context) => {
  const usersQuery = User
    .query()
    .leftJoinRelated({
      role: true
    })
    .withGraphFetched({
      role: true
    })
    .orderBy('full_name', 'desc');

  return paginate(usersQuery, params.limit, params.offset);
};

export default getUsers;
