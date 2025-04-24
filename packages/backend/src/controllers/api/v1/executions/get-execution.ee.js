import Execution from '../../../../models/execution.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const execution = await Execution.query()
    .withGraphFetched({
      flow: {
        steps: true,
      },
    })
    .withSoftDeleted()
    .findById(request.params.executionId)
    .throwIfNotFound();

  renderObject(response, execution);
};
