import User from '../../../../../models/user.js';
import Config from '../../../../../models/config.js';

export default async (request, response) => {
  const { email, password, fullName } = request.body;

  await User.createAdminUser({ email, password, fullName });

  await Config.markInstallationCompleted();

  response.status(204).end();
};
