import { GraphQLObjectType, GraphQLString } from 'graphql';

const flowType = new GraphQLObjectType({
  name: 'Flow',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString }
  }
})

export default flowType;
