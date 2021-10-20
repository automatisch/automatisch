import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

const reconnectionStepType = new GraphQLObjectType({
  name: 'ReconnectionStep',
  fields: {
    step: { type: GraphQLInt },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    fields: { 
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'ReconnectionStepFields',
          fields: {
            name: { type: GraphQLString },
            value: { type: GraphQLString },
            fields: {  
              type: GraphQLList(
                new GraphQLObjectType({
                  name: 'TwitterReconnectionStepFields',
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
