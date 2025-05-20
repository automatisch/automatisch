import Flow from '../../../../models/flow.js';
import { renderObject } from '../../../../helpers/renderer.js';

/**
 * @openapi
 * /v1/flows/{flowId}:
 *   get:
 *     summary: Get flow by ID
 *     description: Retrieves detailed information about a specific flow.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Flows
 *     parameters:
 *       - in: path
 *         name: flowId
 *         description: Unique identifier of the flow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flow details
 */
export default async (request, response) => {
  const flow = await Flow.query()
    .withGraphJoined({ steps: true })
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': request.params.flowId })
    .throwIfNotFound();

  renderObject(response, flow);
};
