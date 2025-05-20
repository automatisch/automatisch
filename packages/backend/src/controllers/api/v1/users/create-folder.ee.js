import User from '../../../../models/user.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const folder = await user.$relatedQuery('folders').insertAndFetch({
    name: request.body.name,
  });

  renderObject(response, folder, { status: 201 });
};
