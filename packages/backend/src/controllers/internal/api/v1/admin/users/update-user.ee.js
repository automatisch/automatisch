import { renderObject } from '../../../../../../helpers/renderer.js';
import User from '../../../../../../models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .withGraphFetched({
      role: true,
    })
    .patchAndFetchById(request.params.userId, userParams(request))
    .throwIfNotFound();

  renderObject(response, user);
};

const userParams = (request) => {
  const { email, fullName, roleId } = request.body;
  return { email, fullName, roleId };
};
