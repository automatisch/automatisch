import { renderObject } from '../../../../../../helpers/renderer.js';
import Template from '../../../../../../models/template.ee.js';

export default async (request, response) => {
  const template = await Template.query()
    .patchAndFetchById(request.params.templateId, templateParams(request))
    .throwIfNotFound();

  renderObject(response, template, {
    serializer: 'AdminTemplate',
  });
};

const templateParams = (request) => {
  const { name } = request.body;
  return { name };
};
