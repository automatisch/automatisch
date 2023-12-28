import SamlAuthProvider from '../../models/saml-auth-provider.ee';

const getSamlAuthProviderRoleMappings = async (_parent, params, context) => {
  context.currentUser.can('read', 'SamlAuthProvider');

  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(params.id)
    .throwIfNotFound();

  const roleMappings = await samlAuthProvider
    .$relatedQuery('samlAuthProvidersRoleMappings')
    .orderBy('remote_role_name', 'asc');

  return roleMappings;
};

export default getSamlAuthProviderRoleMappings;
