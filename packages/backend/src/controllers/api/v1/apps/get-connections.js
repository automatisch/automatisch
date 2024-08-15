import { renderObject } from '../../../../helpers/renderer.js';
import App from '../../../../models/app.js';

export default async (request, response) => {
  const app = await App.findOneByKey(request.params.appKey);

  const connections = await request.currentUser.authorizedConnections
    .clone()
    .select('connections.*')
    .withGraphFetched({
      appConfig: true,
      appAuthClient: true,
    })
    .fullOuterJoinRelated('steps')
    .where({
      'connections.key': app.key,
      'connections.draft': false,
    })
    .countDistinct('steps.flow_id as flowCount')
    .groupBy('connections.id')
    .orderBy('created_at', 'desc');

  renderObject(response, connections);
};
