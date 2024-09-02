import isEmpty from 'lodash/isEmpty.js';
import { renderObject } from '../../../../../helpers/renderer.js';
import SamlAuthProvider from '../../../../../models/saml-auth-provider.ee.js';
import SamlAuthProvidersRoleMapping from '../../../../../models/saml-auth-providers-role-mapping.ee.js';

export default async (request, response) => {
  const samlAuthProviderId = request.params.samlAuthProviderId;

  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(samlAuthProviderId)
    .throwIfNotFound();

  const samlAuthProvidersRoleMappings =
    await SamlAuthProvidersRoleMapping.transaction(async (trx) => {
      await samlAuthProvider
        .$relatedQuery('samlAuthProvidersRoleMappings', trx)
        .delete();

      const roleMappings = samlAuthProvidersRoleMappingsParams(request);

      if (isEmpty(roleMappings)) {
        return [];
      }

      const samlAuthProvidersRoleMappingsData = roleMappings.map(
        (samlAuthProvidersRoleMapping) => ({
          ...samlAuthProvidersRoleMapping,
          samlAuthProviderId: samlAuthProvider.id,
        })
      );

      const samlAuthProvidersRoleMappings =
        await SamlAuthProvidersRoleMapping.query(trx).insertAndFetch(
          samlAuthProvidersRoleMappingsData
        );

      return samlAuthProvidersRoleMappings;
    });

  renderObject(response, samlAuthProvidersRoleMappings);
};

const samlAuthProvidersRoleMappingsParams = (request) => {
  const roleMappings = request.body;

  return roleMappings.map(({ roleId, remoteRoleName }) => ({
    roleId,
    remoteRoleName,
  }));
};
