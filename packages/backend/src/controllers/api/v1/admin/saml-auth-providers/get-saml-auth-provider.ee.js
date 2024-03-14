import { renderObject } from '../../../../../helpers/renderer.js';
import SamlAuthProvider from '../../../../../models/saml-auth-provider.ee.js';

export default async (request, response) => {
  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(request.params.samlAuthProviderId)
    .throwIfNotFound();

  renderObject(response, samlAuthProvider, {
    serializer: 'AdminSamlAuthProvider',
  });
};
