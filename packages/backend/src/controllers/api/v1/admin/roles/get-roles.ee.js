import { renderObject } from '../../../../../helpers/renderer.js';
import Role from '../../../../../models/role.js';

export default async (request, response) => {
  const roles = await Role.query().orderBy('name');

  renderObject(response, roles);
};
