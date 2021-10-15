import { GraphQLString, GraphQLNonNull } from 'graphql';
import Credential from '../../models/credential';
import credentialType from '../types/credential';
import twitterCredentialInputType from '../types/twitter-credential-input';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string,
  data: object
}
const updateCredentialResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let credential = await Credential.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  })

  credential = await credential.$query().patchAndFetch({
    data: {
      ...credential.data,
      ...params.data
    }
  })

  const appClass = (await import(`../../apps/${credential.key}`)).default;

  const appInstance = new appClass(credential.data)
  const verifiedCredentials = await appInstance.verifyCredentials();

  credential = await credential.$query().patchAndFetch({
    data: verifiedCredentials
  })

  return credential;
}

const updateCredential = {
  type: credentialType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(twitterCredentialInputType) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => updateCredentialResolver(params, req)
};

export default updateCredential;
