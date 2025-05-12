import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

/**
 * @openapi
 * /v1/flows:
 *   post:
 *     summary: Create a new flow
 *     description: Creates a new flow for a user. Optionally, a templateId can be provided to base the flow on an existing template.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Flows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user who owns the flow
 *               templateId:
 *                 type: string
 *                 description: ID of the template to base the flow on
 *     responses:
 *       201:
 *         description: Flow created successfully
 */
export default async (request, response) => {
  const { templateId, userId } = request.body;

  const user = await User.query().findById(userId).throwIfNotFound();

  const flow = templateId
    ? await user.createFlowFromTemplate(templateId)
    : await user.createEmptyFlow();

  renderObject(response, flow, { status: 201 });
};
