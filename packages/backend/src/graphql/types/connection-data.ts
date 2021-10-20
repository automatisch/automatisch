import { GraphQLString, GraphQLObjectType } from 'graphql';

const connectionDataType = new GraphQLObjectType({
  name: 'ConnectionData',
  fields: {
    screenName: { type: GraphQLString },
  }
})

export default connectionDataType;
