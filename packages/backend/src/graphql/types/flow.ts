import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

const flowType = new GraphQLObjectType({
  name: 'Flow',
  fields: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StepType = require('./step').default;

    return {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      active: { type: GraphQLBoolean },
      steps: {
        type: GraphQLList(StepType),
      },
    };
  },
});

export const flowInputType = new GraphQLInputObjectType({
  name: 'FlowInput',
  fields: {
    triggerAppKey: { type: GraphQLString },
  },
});

export default flowType;
