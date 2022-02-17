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
            key: { type: GraphQLString },
            name: { type: GraphQLString },
            arguments: {
              type: GraphQLList(
                new GraphQLObjectType({
                  name: 'ActionSubStepArgument',
                  fields: {
                    label: { type: GraphQLString },
                    key: { type: GraphQLString },
                    type: { type: GraphQLString },
                    description: { type: GraphQLString },
                    required: { type: GraphQLBoolean },
                    variables: { type: GraphQLBoolean }
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
