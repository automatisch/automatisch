import { renderObject } from '../../../../../helpers/renderer.js';
import User from '../../../../../models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .withGraphFetched({
      role: true,
    })
    .findById(request.params.userId)
    .throwIfNotFound();

  renderObject(response, user);
};
