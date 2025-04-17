import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const user = await request.currentUser.updatePassword(userParams(request));

  renderObject(response, user);
};

const userParams = (request) => {
  const { currentPassword, password } = request.body;
  return { currentPassword, password };
};
