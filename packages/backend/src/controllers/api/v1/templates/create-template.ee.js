import { renderObject } from '../../../../helpers/renderer.js';
import Template from '../../../../models/template.ee.js';

/**
 * @openapi
 * /v1/templates:
 *   post:
 *     summary: Create a new template
 *     description: Creates a new flow template using an existing flow.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Templates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - flowId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the template
 *               flowId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the flow to base the template on
 *     responses:
 *       201:
 *         description: Template created successfully
 */
export default async (request, response) => {
  const template = await Template.create(templateParams(request));

  renderObject(response, template, {
    serializer: 'PublicTemplate',
    status: 201,
  });
};

const templateParams = (request) => {
  const { name, flowId } = request.body;

  return {
    name,
    flowId,
  };
};
