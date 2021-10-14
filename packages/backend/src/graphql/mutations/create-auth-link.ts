import { GraphQLNonNull, GraphQLString } from 'graphql';
import Credential from '../../models/credential';
import authLinkType from '../types/auth-link';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: number,
}
const createAuthLinkResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const credential = await Credential.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  })

  const appClass = (await import(`../../apps/${credential.key}`)).default;

  const appInstance = new appClass(credential.data)
  const authLink = await appInstance.createAuthLink();

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
