import { renderObject } from '../../../../../helpers/renderer.js';
import SamlAuthProvider from '../../../../../models/saml-auth-provider.ee.js';

export default async (request, response) => {
  const samlAuthProviderId = request.params.samlAuthProviderId;

  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(samlAuthProviderId)
    .throwIfNotFound();

  const samlAuthProvidersRoleMappings =
    await samlAuthProvider.updateRoleMappings(
      samlAuthProvidersRoleMappingsParams(request)
    );

  renderObject(response, samlAuthProvidersRoleMappings);
};

const samlAuthProvidersRoleMappingsParams = (request) => {
  const roleMappings = request.body;

  return roleMappings.map(({ roleId, remoteRoleName }) => ({
    roleId,
    remoteRoleName,
  }));
};
