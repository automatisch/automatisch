import appConfig from '../config/app.js';

export const checkIsCloud = async (request, response, next) => {
  if (appConfig.isCloud) {
    next();
  } else {
    return response.status(404).end();
  }
};

export default checkIsCloud;
