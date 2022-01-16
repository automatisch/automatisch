import { GraphQLObjectType, GraphQLString, GraphQLEnumType, GraphQLInt } from 'graphql';
import ConnectionType from './connection';

const stepType = new GraphQLObjectType({
  name: 'Step',
  fields: {
    id: { type: GraphQLInt },
    key: { type: GraphQLString },
    appKey: { type: GraphQLString },
    type: {
      type: new GraphQLEnumType({
        name: 'StepEnumType',
        values: {
          trigger: { value: 'trigger' },
          action: { value: 'action' },
        }
      })
    },
    connection: { type: ConnectionType }
  }
})

export default stepType;
