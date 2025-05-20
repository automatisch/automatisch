import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const user = await request.currentUser
    .$query()
    .patchAndFetch(userParams(request));

  renderObject(response, user);
};

const userParams = (request) => {
  const { email, fullName } = request.body;
  return { email, fullName };
};
