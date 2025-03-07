import Config from '../models/config.js';
import NotAuthorizedError from '../errors/not-authorized.js';

export const checkTemplatesEnabled = async (request, response, next) => {
  const config = await Config.get();

  if (!config.enableTemplates) {
    throw new NotAuthorizedError();
  }

  next();
};
