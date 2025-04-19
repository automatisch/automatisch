import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  // Extract the authorization code from the query or body if available
  const code = request.query.code || (request.body && request.body.code);

  let connection = await request.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: request.params.connectionId,
    })
    .throwIfNotFound();

  // If code is provided, store it in the connection's formattedData for later use
  if (code) {
    connection = await connection.$query().patchAndFetch({
      formattedData: {
        ...connection.formattedData,
        code
      },
    });
  }

  // Pass the request object to the verification method
  connection = await connection.verifyAndUpdateConnection(request);

  renderObject(response, connection);
};
