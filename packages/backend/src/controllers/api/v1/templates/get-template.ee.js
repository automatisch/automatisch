import { renderObject } from '../../../../helpers/renderer.js';
import Template from '../../../../models/template.ee.js';

export default async (request, response) => {
  const template = await Template.query()
    .findById(request.params.templateId)
    .throwIfNotFound();

  renderObject(response, template, { serializer: 'PublicTemplate' });
};
