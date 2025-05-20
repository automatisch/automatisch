import User from '../../../../../models/user.js';
import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const user = await User.registerUser(userParams(request));

  renderObject(response, user, { status: 201 });
};

const userParams = (request) => {
  const { fullName, email, password } = request.body;

  return {
    fullName,
    email,
    password,
  };
};
