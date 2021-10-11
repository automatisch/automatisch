import { GraphQLString, GraphQLNonNull } from 'graphql';
import App from '../../models/app';
import appType from '../types/app';

type Params = {
  name: string
}

const getAppResolver = (params: Params) => {
  if(!params.name) {
    throw new Error('No name provided.')
  }

  return App.findOneByName(params.name)
}

const getApp = {
  type: appType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params) => getAppResolver(params)
}



export default getApp;
