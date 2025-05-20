import { renderObject } from '../../../../helpers/renderer.js';
import Template from '../../../../models/template.ee.js';

/**
 * @openapi
 * /v1/templates/{templateId}:
 *   get:
 *     summary: Get template by ID
 *     description: Retrieves detailed information about a specific template.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Templates
 *     parameters:
 *       - in: path
 *         name: templateId
 *         description: Unique identifier of the template
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template details
 */
export default async (request, response) => {
  const template = await Template.query()
    .findById(request.params.templateId)
    .throwIfNotFound();

  renderObject(response, template, { serializer: 'PublicTemplate' });
};
