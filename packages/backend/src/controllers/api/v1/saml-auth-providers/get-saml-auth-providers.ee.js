import { renderObject } from '../../../../helpers/renderer.js';
import SamlAuthProvider from '../../../../models/saml-auth-provider.ee.js';

export default async (request, response) => {
  const samlAuthProviders = await SamlAuthProvider.query()
    .where({
      active: true,
    })
    .orderBy('created_at', 'desc');

  renderObject(response, samlAuthProviders);
};
