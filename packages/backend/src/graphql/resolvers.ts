import mutationResolvers from './mutation-resolvers';
import queryResolvers from './query-resolvers';

const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

export default resolvers;
