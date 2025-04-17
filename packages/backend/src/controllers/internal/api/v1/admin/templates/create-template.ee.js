import { renderObject } from '../../../../../../helpers/renderer.js';
import Template from '../../../../../../models/template.ee.js';

export default async (request, response) => {
  const template = await Template.create(templateParams(request));

  renderObject(response, template, {
    serializer: 'AdminTemplate',
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
