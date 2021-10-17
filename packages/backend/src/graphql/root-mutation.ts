import { GraphQLObjectType } from 'graphql';
import createConnection from './mutations/create-connection';
import createAuthLink from './mutations/create-auth-link';
import updateConnection from './mutations/update-connection';

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createConnection: createConnection,
    createAuthLink: createAuthLink,
    updateConnection: updateConnection
  }
});

export default rootMutation;
