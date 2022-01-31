import { GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import appType from '../types/app';
import App from '../../models/app';

type Params = {
  name: string;
  onlyWithTriggers: boolean;
};

const getAppsResolver = (params: Params) => {
  const apps = App.findAll(params.name);

  if (params.onlyWithTriggers) {
    return apps.filter((app: any) => app.triggers?.length);
  }

  return apps;
};

const getApps = {
  type: GraphQLList(appType),
  args: {
    name: { type: GraphQLString },
    onlyWithTriggers: { type: GraphQLBoolean },
  },
  resolve: (_: any, params: Params) => getAppsResolver(params),
};

export default getApps;
