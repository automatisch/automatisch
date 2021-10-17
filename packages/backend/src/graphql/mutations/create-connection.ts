import { GraphQLString, GraphQLNonNull } from 'graphql';
import Connection from '../../models/connection';
import connectionType from '../types/connection';
import twitterCredentialInputType from '../types/twitter-credential-input';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  key: string,
  data: object
}
const createConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const connection = await Connection.query().insert({
    key: params.key,
    data: params.data,
    userId: req.currentUser.id
  });

  return connection;
}

const createConnection = {
  type: connectionType,
  args: {
    key: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(twitterCredentialInputType) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => createConnectionResolver(params, req)
};

export default createConnection;
