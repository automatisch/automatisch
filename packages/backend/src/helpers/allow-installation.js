import Config from '../models/config.js';
import User from '../models/user.js';

export async function allowInstallation(request, response, next) {
  if (await Config.isInstallationCompleted()) {
    return response.status(403).end();
  }

  const hasAnyUsers = await User.query().resultSize() > 0;

  if (hasAnyUsers) {
    return response.status(403).end();
  }

  next();
};
