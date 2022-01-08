import { GraphQLList, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import StepType from './step';

const flowType = new GraphQLObjectType({
  name: 'Flow',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    steps: {
      type: GraphQLList(StepType),
    }
  }
})

export default flowType;
