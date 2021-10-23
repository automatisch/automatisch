import { graphqlHTTP } from 'express-graphql';
import graphQLSchema from '../graphql/graphql-schema'
import logger from '../helpers/logger';

const graphQLInstance = graphqlHTTP({
  schema: graphQLSchema,
  graphiql: true,
  customFormatErrorFn: (error) => {
    logger.error(error.path + ' : ' + error.message + '\n' + error.stack)

    return {
      message: error.message,
      locations: error.locations
    }
  }
})

export default graphQLInstance;
