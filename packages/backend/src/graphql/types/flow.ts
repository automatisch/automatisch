import { GraphQLList, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import StepType from './step';

const flowType = new GraphQLObjectType({
  name: 'Flow',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    steps: {
      type: GraphQLList(StepType),
    }
  }
})

export default flowType;
