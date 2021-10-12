import { GraphQLSchema } from 'graphql';
import rootQuery from './root-query';
import rootMutation from './root-mutation';

const graphQLSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
});

export default graphQLSchema;
