import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import fieldType from './field';
import authenticationStepType from './authentication-step';
import reconnectionStepType from './reconnection-step';
import triggerType from './trigger';

const appType = new GraphQLObjectType({
  name: 'App',
  fields: () => {
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
      connections: { type: GraphQLList(connectionType) },
    }
  }
});

export default appType;
