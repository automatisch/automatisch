import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const connection = await request.currentUser
    .$relatedQuery('connections')
    .insertAndFetch(connectionParams(request));

  const connectionWithAppConfigAndAuthClient = await connection
    .$query()
    .withGraphFetched({
      appConfig: true,
      oauthClient: true,
    });

  renderObject(response, connectionWithAppConfigAndAuthClient, { status: 201 });
};

const connectionParams = (request) => {
  const { oauthClientId, formattedData } = request.body;

  return {
    key: request.params.appKey,
    oauthClientId,
    formattedData,
    verified: false,
  };
};
