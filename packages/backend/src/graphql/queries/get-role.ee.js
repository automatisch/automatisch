import Role from '../../models/role.js';

const getRole = async (_parent, params, context) => {
  context.currentUser.can('read', 'Role');

  return await Role.query()
    .leftJoinRelated({
      permissions: true,
    })
    .withGraphFetched({
      permissions: true,
    })
    .findById(params.id)
    .throwIfNotFound();
};

export default getRole;
