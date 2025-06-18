import kebabCase from 'lodash/kebabCase';
import Role from '../../models/role';
import Permission from '../../models/permission';

type Params = {
  input: {
    name: string;
    description: string;
    permissions: Permission[];
  };
};

// TODO: access
const createRole = async (_parent: unknown, params: Params) => {
  const { name, description, permissions } = params.input;
  const key = kebabCase(name);

  const existingRole = await Role.query().findOne({ key });

  if (existingRole) {
    throw new Error('Role already exists!');
  }

  return await Role.query().insertGraph({
    key,
    name,
    description,
    permissions,
  }, { relate: ['permissions'] }).returning('*');
};

export default createRole;
