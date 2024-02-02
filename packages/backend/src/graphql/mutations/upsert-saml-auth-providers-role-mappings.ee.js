import SamlAuthProvider from '../../models/saml-auth-provider.ee.js';
import SamlAuthProvidersRoleMapping from '../../models/saml-auth-providers-role-mapping.ee.js';
import isEmpty from 'lodash/isEmpty.js';

const upsertSamlAuthProvidersRoleMappings = async (
  _parent,
  params,
  context
) => {
  context.currentUser.can('update', 'SamlAuthProvider');

  const samlAuthProviderId = params.input.samlAuthProviderId;

  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(samlAuthProviderId)
    .throwIfNotFound();

  await samlAuthProvider
    .$relatedQuery('samlAuthProvidersRoleMappings')
    .delete();

  if (isEmpty(params.input.samlAuthProvidersRoleMappings)) {
    return [];
  }

  const samlAuthProvidersRoleMappingsData =
    params.input.samlAuthProvidersRoleMappings.map(
      (samlAuthProvidersRoleMapping) => ({
        ...samlAuthProvidersRoleMapping,
        samlAuthProviderId: samlAuthProvider.id,
      })
    );

  const samlAuthProvidersRoleMappings =
    await SamlAuthProvidersRoleMapping.query().insert(
      samlAuthProvidersRoleMappingsData
    );

  return samlAuthProvidersRoleMappings;
};

export default upsertSamlAuthProvidersRoleMappings;
