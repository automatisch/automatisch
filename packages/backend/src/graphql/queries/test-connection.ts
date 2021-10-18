import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Connection from '../../models/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string,
  data: object
}
const testConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let connection = await Connection.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  })

  const appClass = (await import(`../../apps/${connection.key}`)).default;

  const appInstance = new appClass(connection.data)
  const isStillVerified = await appInstance.isStillVerified();

  return isStillVerified;
}

const testConnection = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => testConnectionResolver(params, req)
};

export default testConnection;
