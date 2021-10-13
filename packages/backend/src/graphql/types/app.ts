import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import fieldType from './field';
import authenticationStepType from './authentication-step';

const appType = new GraphQLObjectType({
  name: 'App',
  fields: {
    name: { type: GraphQLString },
    key: { type: GraphQLString },
    slug: { type: GraphQLString },
    iconUrl: { type: GraphQLString },
    docUrl: { type: GraphQLString },
    primaryColor: { type: GraphQLString },
    fields: { type: GraphQLList(fieldType) },
    authenticationSteps: { type: GraphQLList(authenticationStepType) }
  }
});

export default appType;
