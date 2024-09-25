import { InMemoryCache } from '@apollo/client';
const cache = new InMemoryCache({
  typePolicies: {
    App: {
      keyFields: ['key'],
    },
    Mutation: {
      mutationType: true,
      fields: {},
    },
  },
});
export default cache;
