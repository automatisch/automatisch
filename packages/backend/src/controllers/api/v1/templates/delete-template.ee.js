import Template from '../../../../models/template.ee.js';

/**
 * @openapi
 * /v1/templates/{templateId}:
 *   delete:
 *     summary: Delete a template
 *     description: Deletes a specific template by its ID.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Templates
 *     parameters:
 *       - in: path
 *         name: templateId
 *         description: Unique identifier of the template to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Template deleted successfully
 */
export default async (request, response) => {
  const template = await Template.query()
    .findById(request.params.templateId)
    .throwIfNotFound();

  await template.$query().delete();

  response.status(204).end();
};
