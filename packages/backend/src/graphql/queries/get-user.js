import User from '../../models/user.js';

const getUser = async (_parent, params, context) => {
  context.currentUser.can('read', 'User');

  return await User.query()
    .leftJoinRelated({
      role: true,
    })
    .withGraphFetched({
      role: true,
    })
    .findById(params.id)
    .throwIfNotFound();
};

export default getUser;
