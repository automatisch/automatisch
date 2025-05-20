import { renderObject } from '../../../../helpers/renderer.js';
import Template from '../../../../models/template.ee.js';

export default async (request, response) => {
  const templates = await Template.query().orderBy('created_at', 'asc');

  renderObject(response, templates, {
    serializer: 'PublicTemplate',
  });
};
