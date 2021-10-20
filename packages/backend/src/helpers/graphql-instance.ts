import { graphqlHTTP } from 'express-graphql';
import graphQLSchema from '../graphql/graphql-schema'

const graphQLInstance = graphqlHTTP({
  schema: graphQLSchema,
  graphiql: true,
  customFormatErrorFn: (error) => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack ? error.stack.split('\n') : [],
    path: error.path,
  })
})

export default graphQLInstance;
