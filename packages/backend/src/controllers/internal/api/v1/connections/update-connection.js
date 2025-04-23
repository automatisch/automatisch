import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  let connection = await request.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: request.params.connectionId,
    })
    .throwIfNotFound();

  connection = await connection.updateFormattedData(connectionParams(request));

  renderObject(response, connection);
};

const connectionParams = (request) => {
  const { formattedData, oauthClientId } = request.body;
  return { formattedData, oauthClientId };
};
