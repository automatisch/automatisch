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
    id: { type: GraphQLString },
    previousStepId: { type: GraphQLString },
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
    parameters: { type: GraphQLString },
    connection: { type: ConnectionType },
    position: { type: GraphQLInt },
  },
});

export const stepInputType = new GraphQLInputObjectType({
  name: 'StepInput',
  fields: {
    id: { type: GraphQLString },
    previousStepId: { type: GraphQLString },
    key: { type: GraphQLString },
    appKey: { type: GraphQLString },
    connection: {
      type: new GraphQLInputObjectType({
        name: 'StepConnectionInput',
        fields: {
          id: { type: GraphQLString },
        },
      }),
    },
    flow: {
      type: new GraphQLInputObjectType({
        name: 'StepFlowInput',
        fields: {
          id: { type: GraphQLString },
        },
      }),
    },
    parameters: { type: GraphQLString },
    previousStep: {
      type: new GraphQLInputObjectType({
        name: 'PreviousStepInput',
        fields: {
          id: { type: GraphQLString },
        },
      }),
    },
  },
});

export default stepType;
