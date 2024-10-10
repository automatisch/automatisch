import Config from '../../src/models/config';

export const getConfig = async () => {
  return await Config.get();
};

export const createConfig = async (params = {}) => {
  return await Config.query().insertAndFetch(params);
};

export const updateConfig = async (params = {}) => {
  return await Config.update(params);
};

export const markInstallationCompleted = async () => {
  return await updateConfig({
    installationCompleted: true,
  });
};
