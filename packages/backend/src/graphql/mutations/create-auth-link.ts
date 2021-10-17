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

  const appInstance = new appClass(connection.data)
  const authLink = await appInstance.createAuthLink();

  await connection.$query().patch({
    data: {
      ...connection.data,
      url: authLink.url,
      accessToken: authLink.oauth_token,
      accessSecret: authLink.oauth_token_secret,
    },
    verified: authLink.oauth_callback_confirmed === 'true' ? true : false
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
