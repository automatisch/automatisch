import { GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLObjectType } from 'graphql';
import stepType from './step';

const executeFlowType = new GraphQLObjectType({
  name: 'executeFlowType',
  fields: {
    data: { type: GraphQLJSONObject },
    step: { type: stepType },
  },
});

export default executeFlowType;
