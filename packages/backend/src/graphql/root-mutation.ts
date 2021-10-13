import { GraphQLObjectType } from 'graphql';

import createCredential from './mutations/create-credential';

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createCredential: createCredential
  }
});

export default rootMutation;
