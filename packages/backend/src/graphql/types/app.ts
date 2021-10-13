import { GraphQLList,GraphQLObjectType, GraphQLString } from 'graphql';

import authenticationStepType from './authentication-step';
import fieldType from './field';

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
