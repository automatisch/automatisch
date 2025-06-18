import Role from '../../models/role';
import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
  };
};

// TODO: access
const deleteRole = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const role = await Role.query().findById(params.input.id).throwIfNotFound();

  if (role.isAdmin) {
    throw new Error('Admin role cannot be deleted!');
  }

  /**
   * TODO: consider migrations for users that still have the role or
   * do not let the role get deleted if there are still associated users
   */
  await role.$query().delete();

  return true;
};

export default deleteRole;
