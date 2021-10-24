import { GraphQLNonNull, GraphQLString } from 'graphql';
import Connection from '../../models/connection';
import authLinkType from '../types/auth-link';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: number,
}
const createAuthLinkResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const connection = await Connection.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  })

  const appClass = (await import(`../../apps/${connection.key}`)).default;

  const appInstance = new appClass({
    consumerKey: connection.data.consumerKey,
    consumerSecret: connection.data.consumerSecret
  });

  const authLink = await appInstance.createAuthLink();

  await connection.$query().patch({
    data: {
      ...connection.data,
      ...authLink
    }
  })

  return authLink;
}

const createAuthLink = {
  type: authLinkType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => createAuthLinkResolver(params, req)
};

export default createAuthLink;
