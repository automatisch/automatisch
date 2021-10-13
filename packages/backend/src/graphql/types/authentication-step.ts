import { GraphQLInt,GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

const authenticationStepType = new GraphQLObjectType({
  name: 'authenticationStep',
  fields: {
    step: { type: GraphQLInt },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    fields: { 
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'authenticationStepFields',
          fields: {
            name: { type: GraphQLString },
            value: { type: GraphQLString },
            fields: {  
              type: GraphQLList(
                new GraphQLObjectType({
                  name: 'twitterAuthenticationStepFields',
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
