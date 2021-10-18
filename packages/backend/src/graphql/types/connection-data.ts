import { GraphQLString, GraphQLObjectType } from 'graphql';

const connectionDataType = new GraphQLObjectType({
  name: 'connectionData',
  fields: {
    screenName: { type: GraphQLString },
  }
})

export default connectionDataType;
