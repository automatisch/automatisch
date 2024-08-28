import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  let connection = await request.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: request.params.connectionId,
    })
    .throwIfNotFound();

  if (!connection.formattedData) {
    return renderObject(response, connection);
  }

  connection = await connection.$query().patchAndFetch({
    formattedData: { screenName: connection.formattedData.screenName },
  });

  renderObject(response, connection);
};
