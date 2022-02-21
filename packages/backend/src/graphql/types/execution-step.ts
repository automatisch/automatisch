import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

const executionStepType = new GraphQLObjectType({
  name: 'ExecutionStep',
  fields: {
    executionId: { type: GraphQLString },
    stepId: { type: GraphQLString },
    status: { type: GraphQLString },
    dataIn: { type: GraphQLJSONObject },
    dataOut: { type: GraphQLJSONObject },
  },
});

export default executionStepType;
