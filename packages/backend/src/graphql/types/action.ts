import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';

const actionType = new GraphQLObjectType({
  name: 'Action',
  fields: {
    name: { type: GraphQLString },
    key: { type: GraphQLString },
    description: { type: GraphQLString },
    subSteps: {
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'ActionSubStep',
          fields: {
            name: { type: GraphQLString },
            arguments: {
              type: GraphQLList(
                new GraphQLObjectType({
                  name: 'ActionSubStepArgument',
                  fields: {
                    name: { type: GraphQLString },
                    type: { type: GraphQLString },
                    required: { type: GraphQLBoolean }
                  }
                })
              )
            },
          }
        }),
      )
    }
  }
})

export default actionType;
