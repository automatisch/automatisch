import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { graphqlHTTP } from 'express-graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';

import appConfig from '../config/app.js';
import logger from './logger.js';
import authentication from './authentication.js';
import * as Sentry from './sentry.ee.js';
import resolvers from '../graphql/resolvers.js';
import HttpError from '../errors/http.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schema = loadSchemaSync(join(__dirname, '../graphql/schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const graphQLInstance = graphqlHTTP({
  schema: applyMiddleware(
    schemaWithResolvers,
    authentication.generate(schemaWithResolvers)
  ),
  graphiql: appConfig.isDev,
  customFormatErrorFn: (error) => {
    logger.error(error.path + ' : ' + error.message + '\n' + error.stack);

    if (error.originalError instanceof HttpError) {
      delete error.originalError.response;
    }

    Sentry.captureException(error, {
      tags: { graphql: true },
      extra: {
        source: error.source?.body,
        positions: error.positions,
        path: error.path,
      },
    });

    return error;
  },
});

export default graphQLInstance;
