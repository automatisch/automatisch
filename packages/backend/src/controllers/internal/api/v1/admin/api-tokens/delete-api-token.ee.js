import ApiToken from '../../../../../../models/api-token.ee.js';

export default async (request, response) => {
  const apiToken = await ApiToken.query()
    .findById(request.params.id)
    .throwIfNotFound();

  await apiToken.$query().delete();

  response.status(204).end();
};
