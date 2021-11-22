import { GraphQLObjectType, GraphQLString } from 'graphql';

const flowType = new GraphQLObjectType({
  name: 'Flow',
  fields: {
    name: { type: GraphQLString }
  }
})

export default flowType;
