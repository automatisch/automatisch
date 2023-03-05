import appConfig from '../../config/app';

const getAutomatischInfo = async () => {
  return {
    isCloud: appConfig.isCloud,
  };
};

export default getAutomatischInfo;
