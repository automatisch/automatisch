import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLEnumType, GraphQLInt } from 'graphql';

const stepType = new GraphQLObjectType({
  name: 'Step',
  fields: {
    id: { type: GraphQLString },
    key: { type: GraphQLNonNull(GraphQLString) },
    appKey: { type: GraphQLNonNull(GraphQLString) },
    type: {
      type: new GraphQLEnumType({
        name: 'StepEnumType',
        values: {
          trigger: { value: 'trigger' },
          action: { value: 'action' },
        }
      })
    },
    connectionId: { type: GraphQLNonNull(GraphQLInt) }
  }
})

export default stepType;
