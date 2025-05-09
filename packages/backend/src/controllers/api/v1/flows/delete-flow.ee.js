import Flow from '../../../../models/flow.js';

/**
 * @openapi
 * /v1/flows/{flowId}:
 *   delete:
 *     summary: Delete a flow
 *     description: Deletes a specific flow by its ID.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Flows
 *     parameters:
 *       - in: path
 *         name: flowId
 *         description: Unique identifier of the flow to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Flow deleted successfully
 */
export default async (request, response) => {
  const flow = await Flow.query()
    .findById(request.params.flowId)
    .throwIfNotFound();

  await flow.delete();

  response.status(204).end();
};
