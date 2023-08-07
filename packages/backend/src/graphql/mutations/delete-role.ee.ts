import Role from '../../models/role';
import SamlAuthProvider from '../../models/saml-auth-provider.ee';
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

  const role = await Role.query().findById(params.input.id).throwIfNotFound();
  const count = await role.$relatedQuery('users').resultSize();

  if (count > 0) {
    throw new Error('All users must be migrated away from the role!');
  }

  if (role.isAdmin) {
    throw new Error('Admin role cannot be deleted!');
  }

  const samlAuthProviderUsingDefaultRole = await SamlAuthProvider.query()
    .where({ default_role_id: role.id })
    .limit(1)
    .first();

  if (samlAuthProviderUsingDefaultRole) {
    throw new Error(
      'You need to change the default role in the SAML configuration before deleting this role.'
    );
  }

  // delete permissions first
  await role.$relatedQuery('permissions').delete();
  await role.$query().delete();

  return true;
};

export default deleteRole;
