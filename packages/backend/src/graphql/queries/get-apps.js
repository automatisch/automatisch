import App from '../../models/app.js';

const getApps = async (_parent, params) => {
  const apps = await App.findAll(params.name);

  if (params.onlyWithTriggers) {
    return apps.filter((app) => app.triggers?.length);
  }

  if (params.onlyWithActions) {
    return apps.filter((app) => app.actions?.length);
  }

  return apps;
};

export default getApps;
