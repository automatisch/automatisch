import { renderObject } from '../../../../helpers/renderer.js';
import paginateRest from '../../../../helpers/pagination-rest.js';

export default async (request, response) => {
  const flowsQuery = request.currentUser.authorizedFlows
    .clone()
    .withGraphFetched({
      steps: true,
    })
    .where((builder) => {
      if (request.query.name) {
        builder.where('flows.name', 'ilike', `%${request.query.name}%`);
      }
    })
    .orderBy('active', 'desc')
    .orderBy('updated_at', 'desc');

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};
