import { GraphQLString, GraphQLNonNull } from 'graphql';
import Connection from '../../models/connection';
import App from '../../models/app';
import connectionType from '../types/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import { GraphQLJSONObject } from 'graphql-type-json';

type Params = {
  key: string,
  data: object
}
const createConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const app = App.findOneByKey(params.key);
  const connection = await Connection.query().insert({
    key: params.key,
    data: params.data,
    userId: req.currentUser.id
  });

  return {
    ...connection,
    app,
  };
}

const createConnection = {
  type: connectionType,
  args: {
    key: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLJSONObject) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => createConnectionResolver(params, req)
};

export default createConnection;
