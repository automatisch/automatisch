import { GraphQLList,GraphQLString } from 'graphql';

import App from '../../models/app';
import appType from '../types/app';

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
