import { GraphQLNonNull } from 'graphql';
import App from '../../models/app';
import connectionType from '../types/connection';
import availableAppsEnumType from '../types/available-apps-enum-type';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import { GraphQLJSONObject } from 'graphql-type-json';
import { IJSONObject } from '@automatisch/types';

type Params = {
  key: string;
  formattedData: IJSONObject;
};
const createConnectionResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const app = App.findOneByKey(params.key);

  const connection = await req.currentUser.$relatedQuery('connections').insert({
    key: params.key,
    formattedData: params.formattedData,
  });

  return {
    ...connection,
    app,
  };
};

const createConnection = {
  type: connectionType,
  args: {
    key: { type: GraphQLNonNull(availableAppsEnumType) },
    formattedData: { type: GraphQLNonNull(GraphQLJSONObject) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    createConnectionResolver(params, req),
};

export default createConnection;
