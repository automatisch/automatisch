import kebabCase from 'lodash/kebabCase.js';
import { renderObject } from '../../../../../helpers/renderer.js';
import Role from '../../../../../models/role.js';

export default async (request, response) => {
  const roleData = roleParams(request);

  const roleWithPermissions = await Role.query().insertGraphAndFetch(roleData, {
    relate: ['permissions'],
  });

  renderObject(response, roleWithPermissions, { status: 201 });
};

const roleParams = (request) => {
  const { name, description, permissions } = request.body;
  const key = kebabCase(name);

  return {
    key,
    name,
    description,
    permissions,
  };
};
