import kebabCase from 'lodash/kebabCase.js';
import Role from '../../models/role.js';

const createRole = async (_parent, params, context) => {
  context.currentUser.can('create', 'Role');

  const { name, description, permissions } = params.input;
  const key = kebabCase(name);

  const existingRole = await Role.query().findOne({ key });

  if (existingRole) {
    throw new Error('Role already exists!');
  }

  return await Role.query()
    .insertGraph(
      {
        key,
        name,
        description,
        permissions,
      },
      { relate: ['permissions'] }
    )
    .returning('*');
};

export default createRole;
