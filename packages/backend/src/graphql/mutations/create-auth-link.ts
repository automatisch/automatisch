import { GraphQLNonNull, GraphQLInt } from 'graphql';
import Credential from '../../models/credential';
import authLinkType from '../types/auth-link';
import User from '../../models/user';

type Params = {
  credentialId: number,
}
const createAuthLinkResolver = async (params: Params) => {
  const user = await User.query().findOne({
    email: 'user@automatisch.com'
  })

  const credential = await Credential.query().findOne({
    user_id: user.id,
    id: params.credentialId
  })

  const appClass = (await import(`../../apps/${credential.key}`)).default;

  const appInstance = new appClass(credential.data)
  const authLink = await appInstance.createAuthLink();

  return authLink;
}

const createAuthLink = {
  type: authLinkType,
  args: {
    credentialId: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: (_: any, params: Params) => createAuthLinkResolver(params)
};

export default createAuthLink;
