import { buildSchema } from 'graphql';

const graphQLSchema = buildSchema(`
  type Query {
    getApps: [String!]
    getAppsByName(name: String!): [String!]
  }
`);

export default graphQLSchema;
