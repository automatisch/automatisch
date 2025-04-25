import Template from '../../../../models/template.ee.js';

export default async (request, response) => {
  const template = await Template.query()
    .findById(request.params.templateId)
    .throwIfNotFound();

  await template.$query().delete();

  response.status(204).end();
};
