import mutationResolvers from './mutation-resolvers.js';
import queryResolvers from './query-resolvers.js';

const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

export default resolvers;
