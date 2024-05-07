import Config from '../models/config.js';

export async function authorizeInstallation(request, response, next) {
  if (await Config.isInstallationCompleted()) {
    return response.status(403).end();
  } else {
    next();
  }
};
