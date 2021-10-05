import { graphqlHTTP } from 'express-graphql';
import rootResolver from '../graphql/root-resolver'
import graphQLSchema from '../graphql/graphql-schema'

const graphQLInstance = graphqlHTTP({
  schema: graphQLSchema,
  rootValue: rootResolver,
  graphiql: true,
})

export default graphQLInstance;
