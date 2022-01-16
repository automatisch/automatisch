import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';

const triggerType = new GraphQLObjectType({
  name: 'Trigger',
  fields: {
    name: { type: GraphQLString },
    key: { type: GraphQLString },
    description: { type: GraphQLString },
    subSteps: {
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'TriggerSubStep',
          fields: {
            name: { type: GraphQLString },
            arguments: {
              type: GraphQLList(
                new GraphQLObjectType({
                  name: 'TriggerSubStepArgument',
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

export default triggerType;
