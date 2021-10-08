import { buildSchema } from 'graphql';

const graphQLSchema = buildSchema(`
  type Query {
    getApps(name: String): [String!]
  }
`);

export default graphQLSchema;
