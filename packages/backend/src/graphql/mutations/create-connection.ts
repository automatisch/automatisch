import { GraphQLNonNull } from 'graphql';
import App from '../../models/app';
import connectionType from '../types/connection';
import availableAppsEnumType from '../types/available-apps-enum-type';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import { GraphQLJSONObject } from 'graphql-type-json';

type Params = {
  key: string;
  data: object;
};
const createConnectionResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const app = App.findOneByKey(params.key);

  const connection = await req.currentUser.$relatedQuery('connections').insert({
    key: params.key,
    data: params.data,
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
    data: { type: GraphQLNonNull(GraphQLJSONObject) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    createConnectionResolver(params, req),
};

export default createConnection;
