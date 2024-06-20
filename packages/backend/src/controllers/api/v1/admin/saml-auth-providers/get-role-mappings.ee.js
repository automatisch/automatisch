import { renderObject } from '../../../../../helpers/renderer.js';
import SamlAuthProvider from '../../../../../models/saml-auth-provider.ee.js';

export default async (request, response) => {
  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(request.params.samlAuthProviderId)
    .throwIfNotFound();

  const roleMappings = await samlAuthProvider
    .$relatedQuery('samlAuthProvidersRoleMappings')
    .orderBy('remote_role_name', 'asc');

  renderObject(response, roleMappings);
};
