import Execution from '../../../../models/execution.js';
import { renderObject } from '../../../../helpers/renderer.js';

/**
 * @openapi
 * /v1/executions/{executionId}:
 *   get:
 *     summary: Get execution by ID
 *     description: Retrieves detailed information about a specific execution.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Executions
 *     parameters:
 *       - in: path
 *         name: executionId
 *         required: true
 *         description: Unique identifier of the execution
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Execution details
 *       404:
 *         description: Execution not found
 */
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
