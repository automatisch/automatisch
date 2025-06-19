import { IApp } from '@automatisch/types';
import App from '../../models/app';

type Params = {
  name: string;
  onlyWithTriggers: boolean;
  onlyWithActions: boolean;
};

const getApps = async (_parent: unknown, params: Params) => {
  const apps = await App.findAll(params.name);

  if (params.onlyWithTriggers) {
    return apps.filter((app: IApp) => app.triggers?.length);
  }

  if (params.onlyWithActions) {
    return apps.filter((app: IApp) => app.actions?.length);
  }

  return apps;
};

export default getApps;
