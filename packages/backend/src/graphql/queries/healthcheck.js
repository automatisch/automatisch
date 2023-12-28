import appConfig from '../../config/app';

const healthcheck = () => {
  return {
    version: appConfig.version,
  };
};

export default healthcheck;
