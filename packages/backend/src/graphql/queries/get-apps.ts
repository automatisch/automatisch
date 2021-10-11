import { GraphQLString, GraphQLList } from 'graphql';
import appType from '../types/app';
import App from '../../models/app';

type Params = {
  name: string
}

const getAppsResolver = (params: Params) => {
  return App.findAll(params.name)
}

const getApps = {
  type: GraphQLList(appType),
  args: {
    name: { type: GraphQLString }
  },
  resolve: (_: any, params: Params) => getAppsResolver(params)
}

export default getApps;
