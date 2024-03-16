import { renderObject } from '../../../../helpers/renderer.js';
import paginateRest from '../../../../helpers/pagination-rest.js';

export default async (request, response) => {
  const execution = await request.currentUser.authorizedExecutions
    .clone()
    .withSoftDeleted()
    .findById(request.params.executionId)
    .throwIfNotFound();

  const executionStepsQuery = execution
    .$relatedQuery('executionSteps')
    .withSoftDeleted()
    .withGraphFetched('step')
    .orderBy('created_at', 'asc');

  const executionSteps = await paginateRest(
    executionStepsQuery,
    request.query.page
  );

  renderObject(response, executionSteps);
};
