import appConfig from '../../config/app.js';

const healthcheck = () => {
  return {
    version: appConfig.version,
  };
};

export default healthcheck;
