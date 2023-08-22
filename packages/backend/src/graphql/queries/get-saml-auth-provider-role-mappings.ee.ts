import Context from '../../types/express/context';
import SamlAuthProvider from '../../models/saml-auth-provider.ee';

type Params = {
  id: string;
}

const getSamlAuthProviderRoleMappings = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('read', 'SamlAuthProvider');

  const samlAuthProvider = await SamlAuthProvider
    .query()
    .findById(params.id)
    .throwIfNotFound();

  const roleMappings = await samlAuthProvider
    .$relatedQuery('samlAuthProvidersRoleMappings')
    .orderBy('remote_role_name', 'asc')

  return roleMappings;
};

export default getSamlAuthProviderRoleMappings;
