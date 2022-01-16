import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import fieldType from './field';
import authenticationStepType from './authentication-step';
import reconnectionStepType from './reconnection-step';
import triggerType from './trigger';
import actionType from './action';

const appType = new GraphQLObjectType({
  name: 'App',
  fields: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const connectionType = require('./connection').default;

    return {
      name: { type: GraphQLString },
      key: { type: GraphQLString },
      connectionCount: { type: GraphQLInt },
      iconUrl: { type: GraphQLString },
      docUrl: { type: GraphQLString },
      primaryColor: { type: GraphQLString },
      fields: { type: GraphQLList(fieldType) },
      authenticationSteps: { type: GraphQLList(authenticationStepType) },
      reconnectionSteps: { type: GraphQLList(reconnectionStepType) },
      triggers: { type: GraphQLList(triggerType) },
      actions: { type: GraphQLList(actionType) },
      connections: { type: GraphQLList(connectionType) },
    }
  }
});

export default appType;
