import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

const authenticationStepType = new GraphQLObjectType({
  name: 'AuthenticationStep',
  fields: {
    step: { type: GraphQLInt },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    arguments: { 
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'AuthenticationStepArgument',
          fields: {
            name: { type: GraphQLString },
            value: { type: GraphQLString },
            properties: {  
              type: GraphQLList(
                new GraphQLObjectType({
                  name: 'AuthenticationStepProperty',
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

export default authenticationStepType;
