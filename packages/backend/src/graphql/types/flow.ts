import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import StepType from './step';

const flowType = new GraphQLObjectType({
  name: 'Flow',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    steps: {
      type: GraphQLList(StepType),
    },
  },
});

export const flowInputType = new GraphQLInputObjectType({
  name: 'FlowInput',
  fields: {
    triggerAppKey: { type: GraphQLString },
  },
});

export default flowType;
