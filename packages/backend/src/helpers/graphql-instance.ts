import { graphqlHTTP } from 'express-graphql';
import graphQLSchema from '../graphql/graphql-schema'

const graphQLInstance = graphqlHTTP({
  schema: graphQLSchema,
  graphiql: true,
})

export default graphQLInstance;
