import { GraphQLString, GraphQLNonNull } from 'graphql';
import Credential from '../../models/credential';
import credentialType from '../types/credential';
import twitterCredentialInputType from '../types/twitter-credential-input';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  key: string,
  displayName: string,
  data: object
}
const createCredentialResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const credential = await Credential.query().insert({
    displayName: params.displayName,
    key: params.key,
    data: params.data,
    userId: req.currentUser.id
  });

  return credential;
}

const createCredential = {
  type: credentialType,
  args: {
    key: { type: GraphQLNonNull(GraphQLString) },
    displayName: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(twitterCredentialInputType) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => createCredentialResolver(params, req)
};

export default createCredential;
