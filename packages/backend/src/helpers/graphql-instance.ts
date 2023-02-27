import { join } from 'path';
import { graphqlHTTP } from 'express-graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import logger from '../helpers/logger';
import authentication from '../helpers/authentication';
import resolvers from '../graphql/resolvers';
import HttpError from '../errors/http';

const schema = loadSchemaSync(join(__dirname, '../graphql/schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const graphQLInstance = graphqlHTTP({
  schema: applyMiddleware(schemaWithResolvers, authentication),
  graphiql: true,
  customFormatErrorFn: (error) => {
    logger.error(error.path + ' : ' + error.message + '\n' + error.stack);

    if (error.originalError instanceof HttpError) {
      delete (error.originalError as HttpError).response;
    }

    return error;
  },
});

export default graphQLInstance;
