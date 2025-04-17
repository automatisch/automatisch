import { renderObject } from '../../../../../../helpers/renderer.js';
import ApiToken from '../../../../../../models/api-token.ee.js';

export default async (request, response) => {
  const apiTokens = await ApiToken.query().orderBy('created_at', 'desc');

  renderObject(response, apiTokens, { serializer: 'AdminApiToken' });
};
