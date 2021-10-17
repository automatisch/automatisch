import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import fieldType from './field';
import authenticationStepType from './authentication-step';

const appType = new GraphQLObjectType({
  name: 'App',
  fields: {
    name: { type: GraphQLString },
    key: { type: GraphQLString },
    connectionCount: { type: GraphQLInt },
    iconUrl: { type: GraphQLString },
    docUrl: { type: GraphQLString },
    primaryColor: { type: GraphQLString },
    fields: { type: GraphQLList(fieldType) },
    authenticationSteps: { type: GraphQLList(authenticationStepType) }
  }
});

export default appType;
