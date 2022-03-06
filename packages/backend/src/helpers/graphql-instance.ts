import { graphqlHTTP } from 'express-graphql';
import logger from '../helpers/logger';
import { applyMiddleware } from 'graphql-middleware';
import authentication from '../helpers/authentication';
import { join } from 'path';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import resolvers from '../graphql/resolvers';

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

    return {
      message: error.message,
      locations: error.locations,
    };
  },
});

export default graphQLInstance;
