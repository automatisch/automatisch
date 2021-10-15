import { GraphQLObjectType } from 'graphql';
import createCredential from './mutations/create-credential';
import createAuthLink from './mutations/create-auth-link';
import updateCredential from './mutations/update-credential';

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createCredential: createCredential,
    createAuthLink: createAuthLink,
    updateCredential: updateCredential
  }
});

export default rootMutation;
