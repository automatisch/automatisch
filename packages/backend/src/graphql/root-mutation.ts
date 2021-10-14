import { GraphQLObjectType } from 'graphql';
import createCredential from './mutations/create-credential';
import createAuthLink from './mutations/create-auth-link';

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createCredential: createCredential,
    createAuthLink: createAuthLink
  }
});

export default rootMutation;
