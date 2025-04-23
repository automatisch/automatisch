import { renderObject } from '../../../../../../helpers/renderer.js';
import Role from '../../../../../../models/role.js';

export default async (request, response) => {
  const role = await Role.query()
    .findById(request.params.roleId)
    .throwIfNotFound();

  const updatedRoleWithPermissions = await role.updateWithPermissions(
    roleParams(request)
  );

  renderObject(response, updatedRoleWithPermissions);
};

const roleParams = (request) => {
  const { name, description, permissions } = request.body;

  return {
    name,
    description,
    permissions,
  };
};
