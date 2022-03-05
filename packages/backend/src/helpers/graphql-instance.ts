import { graphqlHTTP } from 'express-graphql';
import graphQLSchema from '../graphql/graphql-schema';
import logger from '../helpers/logger';
import { applyMiddleware } from 'graphql-middleware';
import authentication from '../helpers/authentication';

const graphQLInstance = graphqlHTTP({
  schema: applyMiddleware(graphQLSchema, authentication),
  graphiql: true,
  customFormatErrorFn: (error) => {
    logger.error(error.path + ' : ' + error.message + '\n' + error.stack);

    return {
      message: error.message,
      locations: error.locations,
    };
  },
});

export default graphQLInstance;
