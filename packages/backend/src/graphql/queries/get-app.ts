import { GraphQLString, GraphQLNonNull } from 'graphql';
import App from '../../models/app';
import appType from '../types/app';

type Params = {
  key: string
}

const getAppResolver = (params: Params) => {
  if(!params.key) {
    throw new Error('No key provided.')
  }

  return App.findOneByKey(params.key)
}

const getApp = {
  type: appType,
  args: {
    key: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params) => getAppResolver(params)
}



export default getApp;
