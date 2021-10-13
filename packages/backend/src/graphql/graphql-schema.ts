import { GraphQLSchema } from 'graphql';

import rootMutation from './root-mutation';
import rootQuery from './root-query';

const graphQLSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
});

export default graphQLSchema;
