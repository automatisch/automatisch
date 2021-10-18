import { GraphQLObjectType } from 'graphql';
import createConnection from './mutations/create-connection';
import createAuthLink from './mutations/create-auth-link';
import updateConnection from './mutations/update-connection';
import deleteConnection from './mutations/delete-connection';

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createConnection,
    createAuthLink,
    updateConnection,
    deleteConnection
  }
});

export default rootMutation;
