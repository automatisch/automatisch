import { renderObject } from '../../../../helpers/renderer.js';
import Template from '../../../../models/template.ee.js';

/**
 * @openapi
 * /v1/templates:
 *   get:
 *     summary: List templates
 *     description: Retrieves a list of all flow templates.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Templates
 *     responses:
 *       200:
 *         description: List of templates
 */
export default async (request, response) => {
  const templates = await Template.query().orderBy('created_at', 'asc');

  renderObject(response, templates, {
    serializer: 'PublicTemplate',
  });
};
