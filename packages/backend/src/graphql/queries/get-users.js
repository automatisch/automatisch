import paginate from '../../helpers/pagination.js';
import User from '../../models/user.js';

const getUsers = async (_parent, params, context) => {
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
