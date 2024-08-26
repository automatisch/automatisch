import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  let connection = await request.currentUser.authorizedConnections
    .clone()
    .findOne({
      id: request.params.connectionId,
    })
    .throwIfNotFound();

  connection = await connection.testAndUpdateConnection();

  renderObject(response, connection);
};
