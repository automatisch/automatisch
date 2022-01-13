import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';
import ConnectionType from './connection';

const stepType = new GraphQLObjectType({
  name: 'Step',
  fields: {
    id: { type: GraphQLInt },
    previousStepId: { type: GraphQLInt },
    key: { type: GraphQLString },
    appKey: { type: GraphQLString },
    type: {
      type: new GraphQLEnumType({
        name: 'StepEnumType',
        values: {
          trigger: { value: 'trigger' },
          action: { value: 'action' },
        },
      }),
    },
    connection: { type: ConnectionType },
    position: { type: GraphQLInt },
  },
});

export const stepInputType = new GraphQLInputObjectType({
  name: 'StepInput',
  fields: {
    id: { type: GraphQLInt },
    previousStepId: { type: GraphQLInt },
    key: { type: GraphQLString },
    appKey: { type: GraphQLString },
    connection: {
      type: new GraphQLInputObjectType({
        name: 'StepConnectionInput',
        fields: {
          id: { type: GraphQLInt },
        }
      })
    },
    flow: {
      type: new GraphQLInputObjectType({
        name: 'StepFlowInput',
        fields: {
          id: { type: GraphQLInt },
        }
      })
    }
  }
})

export default stepType;
