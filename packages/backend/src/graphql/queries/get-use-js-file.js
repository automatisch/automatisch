import appConfig from '../../config/app';

const getUseJsFile = async () => {
  return {
    canInvoke: true,
    appConfig,
  };
};

export default getUseJsFile;
