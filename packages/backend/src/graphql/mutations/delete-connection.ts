import { GraphQLInt, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Connection from '../../models/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: number,
  data: object
}
const deleteConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  await Connection.query().delete().findOne({
    user_id: req.currentUser.id,
    id: params.id
  }).throwIfNotFound();

  return;
}

const deleteConnection = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => deleteConnectionResolver(params, req)
};

export default deleteConnection;
