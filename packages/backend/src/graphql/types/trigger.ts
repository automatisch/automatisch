import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

const triggerType = new GraphQLObjectType({
  name: 'Trigger',
  fields: {
    name: { type: GraphQLString },
    key: { type: GraphQLString },
    description: { type: GraphQLString }
  }
})

export default triggerType;
