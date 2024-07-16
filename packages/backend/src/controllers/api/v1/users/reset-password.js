import User from '../../../../models/user.js';
import { renderError } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const { token, password } = request.body;

  const user = await User.query()
    .findOne({
      reset_password_token: token,
    })
    .throwIfNotFound();

  if (!user.isResetPasswordTokenValid()) {
    return renderError(response, [{ general: [invalidTokenErrorMessage] }]);
  }

  await user.resetPassword(password);

  response.status(204).end();
};

const invalidTokenErrorMessage =
  'Reset password link is not valid or expired. Try generating a new link.';
