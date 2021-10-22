import { GraphQLObjectType } from 'graphql';
import createConnection from './mutations/create-connection';
import createAuthLink from './mutations/create-auth-link';
import updateConnection from './mutations/update-connection';
import resetConnection from './mutations/reset-connection';
import verifyConnection from './mutations/verify-connection';
import deleteConnection from './mutations/delete-connection';

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createConnection,
    createAuthLink,
    updateConnection,
    resetConnection,
    verifyConnection,
    deleteConnection
  }
});

export default rootMutation;
