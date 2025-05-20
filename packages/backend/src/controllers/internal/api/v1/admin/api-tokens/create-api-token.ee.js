import { renderObject } from '../../../../../../helpers/renderer.js';
import ApiToken from '../../../../../../models/api-token.ee.js';

export default async (request, response) => {
  const apiToken = await ApiToken.query().insertAndFetch({});

  renderObject(response, apiToken, {
    serializer: 'AdminApiTokenFull',
    status: 201,
  });
};
