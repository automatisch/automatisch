import { renderObject } from '../../../../../helpers/renderer.js';
import Role from '../../../../../models/role.js';

export default async (request, response) => {
  const role = await Role.query()
    .leftJoinRelated({
      permissions: true,
    })
    .withGraphFetched({
      permissions: true,
    })
    .findById(request.params.roleId)
    .throwIfNotFound();

  renderObject(response, role);
};
