import User from '../../../../models/user.js';
import { renderObject, renderError } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const { email, password } = request.body;
  const token = await User.authenticate(email, password);

  if (token) {
    return renderObject(response, { token });
  }

  renderError(response, [{ general: ['Incorrect email or password.'] }]);
};
