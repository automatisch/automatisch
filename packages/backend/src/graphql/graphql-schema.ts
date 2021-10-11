import { GraphQLSchema } from 'graphql';
import rootQuery from './root-query';

const graphQLSchema = new GraphQLSchema({
  query: rootQuery,
});

export default graphQLSchema;
