import SamlAuthProvider from '../../models/saml-auth-provider.ee';
import SamlAuthProvidersRoleMapping from '../../models/saml-auth-providers-role-mapping.ee';
import Context from '../../types/express/context';
import isEmpty from 'lodash/isEmpty';

type Params = {
  input: {
    samlAuthProviderId: string;
    samlAuthProvidersRoleMappings: [
      {
        roleId: string;
        remoteRoleName: string;
      }
    ];
  };
};

const upsertSamlAuthProvidersRoleMappings = async (
  _parent: unknown,
  params: Params,
  context: Context
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
