import Role from '../../../../../../models/role.js';

export default async (request, response) => {
  const role = await Role.query()
    .findById(request.params.roleId)
    .throwIfNotFound();

  await role.deleteWithPermissions();

  response.status(204).end();
};
