import Flow from '../../../../models/flow.js';
import { renderObject } from '../../../../helpers/renderer.js';

/**
 * @openapi
 * /v1/flows/{flowId}/status:
 *   patch:
 *     summary: Update flow status
 *     description: Enables or disables a flow by setting its active status.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - active
 *             properties:
 *               active:
 *                 type: boolean
 *                 description: Whether the flow is active or not
 *     responses:
 *       200:
 *         description: Flow status updated
 */
export default async (request, response) => {
  let flow = await Flow.query()
    .findOne({
      id: request.params.flowId,
    })
    .throwIfNotFound();

  flow = await flow.updateStatus(request.body.active);

  renderObject(response, flow);
};
