import kebabCase from 'lodash/kebabCase';
import Permission from '../../models/permission';
import Role from '../../models/role';
import Context from '../../types/express/context';

type Params = {
  input: {
    name: string;
    description: string;
    permissions: Permission[];
  };
};

const createRole = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('create', 'Role');

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
