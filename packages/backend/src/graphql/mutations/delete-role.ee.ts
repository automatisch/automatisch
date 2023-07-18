import Role from '../../models/role';
import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
  };
};

const deleteRole = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('delete', 'Role');

  const role = await Role
    .query()
    .findById(params.input.id)
    .throwIfNotFound();

  const count = await role
    .$relatedQuery('users')
    .resultSize();

  if (count > 0) {
    throw new Error('All users must be migrated away from the role!');
  }

  if (role.isAdmin) {
    throw new Error('Admin role cannot be deleted!');
  }

  // delete permissions first
  await role.$relatedQuery('permissions').delete();
  await role.$query().delete();

  return true;
};

export default deleteRole;
