import { renderObject } from '../../../../../../helpers/renderer.js';
import SamlAuthProvider from '../../../../../../models/saml-auth-provider.ee.js';

export default async (request, response) => {
  const samlAuthProviderId = request.params.samlAuthProviderId;

  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(samlAuthProviderId)
    .throwIfNotFound();

  const roleMappings = await samlAuthProvider.updateRoleMappings(
    roleMappingsParams(request)
  );

  renderObject(response, roleMappings);
};

const roleMappingsParams = (request) => {
  const roleMappings = request.body;

  return roleMappings.map(({ roleId, remoteRoleName }) => ({
    roleId,
    remoteRoleName,
  }));
};
