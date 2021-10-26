import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

const reconnectionStepType = new GraphQLObjectType({
  name: 'ReconnectionStep',
  fields: {
    step: { type: GraphQLInt },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    arguments: { 
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'ReconnectionStepArgument',
          fields: {
            name: { type: GraphQLString },
            value: { type: GraphQLString },
            properties: {  
              type: GraphQLList(
                new GraphQLObjectType({
                  name: 'ReconnectionStepProperty',
                  fields: {
                    name: { type: GraphQLString },
                    value: { type: GraphQLString }
                  }
                })
              )
            },
          }
        }),
      )
    }
  }
})

export default reconnectionStepType;
