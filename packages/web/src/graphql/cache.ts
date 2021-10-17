import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    App: {
      keyFields: ['key']
    }
  }
});

export default cache;
