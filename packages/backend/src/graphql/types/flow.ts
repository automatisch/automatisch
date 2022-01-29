import {
  GraphQLList,
  GraphQLObjectType,
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

export default flowType;
