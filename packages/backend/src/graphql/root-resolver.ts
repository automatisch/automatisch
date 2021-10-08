import getApps from './queries/get-apps';
import getAppsByName from './queries/get-apps-by-name';

const rootResolver = {
  getApps: getApps,
  getAppsByName: getAppsByName
};

export default rootResolver;
