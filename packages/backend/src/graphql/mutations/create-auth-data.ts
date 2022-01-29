import { GraphQLNonNull, GraphQLString } from 'graphql';
import authLinkType from '../types/auth-link';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string;
};

const createAuthDataResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const connection = await req.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${connection.key}`)).default;

  const appInstance = new appClass({
    consumerKey: connection.data.consumerKey,
    consumerSecret: connection.data.consumerSecret,
  });

  const authLink = await appInstance.authenticationClient.createAuthData();

  await connection.$query().patch({
    data: {
      ...connection.data,
      ...authLink,
    },
  });

  return authLink;
};

const createAuthData = {
  type: authLinkType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    createAuthDataResolver(params, req),
};

export default createAuthData;
