import { GraphQLCompositeType,GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import Credential from '../../models/credential';
import User from '../../models/user';
import credentialType from '../types/credential';
import twitterCredentialInputType from '../types/twitter-credential-input';

type Params = {
  key: string,
  displayName: string,
  data: object
}
const createCredentialResolver = async (params: Params) => {
  const user = await User.query().findOne({
    email: 'user@automatisch.com'
  })

  const credential = await Credential.query().insert({
    displayName: params.displayName,
    key: params.key,
    data: params.data,
    userId: user.id
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
  resolve: (_: any, params: Params) => createCredentialResolver(params)
};

export default createCredential;
