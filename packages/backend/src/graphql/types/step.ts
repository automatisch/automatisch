import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLList,
} from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import ConnectionType from './connection';
import ExecutionStepType from './execution-step';

const stepType = new GraphQLObjectType({
  name: 'Step',
  fields: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const FlowType = require('./flow').default;

    return {
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
      parameters: { type: GraphQLJSONObject },
      connection: { type: ConnectionType },
      flow: { type: FlowType },
      position: { type: GraphQLInt },
      status: { type: GraphQLString },
      executionSteps: {
        type: GraphQLList(ExecutionStepType),
      },
    };
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
    parameters: { type: GraphQLJSONObject },
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
