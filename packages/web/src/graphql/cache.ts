import { InMemoryCache } from '@apollo/client';
import offsetLimitPagination from './pagination';

const cache = new InMemoryCache({
  typePolicies: {
    App: {
      keyFields: ['key']
    },
    Mutation: {
      mutationType: true,
      fields: {
        createConnection: {
          merge(existing, newConnection, { readField, cache }) {
            const appKey = readField('key', newConnection);
            const appCacheId = cache.identify({
              __typename: 'App',
              key: appKey,
            });

            cache.modify({
              id: appCacheId,
              fields: {
                connections: (existingConnections) => {
                  return [...existingConnections, newConnection];
                }
              }
            });

            return newConnection;
          }
        }
      }
    },
    Query: {
      fields: {
        getExecutionSteps: offsetLimitPagination(['executionId', 'limit']),
      }
    }
  }
});

export default cache;
