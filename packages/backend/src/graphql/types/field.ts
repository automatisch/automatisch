import { GraphQLObjectType, GraphQLString, GraphQLBoolean} from 'graphql';

const fieldType = new GraphQLObjectType({
  name: 'field',
  fields: {
    key: { type: GraphQLString },
    label: { type: GraphQLString },
    type: { type: GraphQLString },
    required: { type: GraphQLBoolean},
    readOnly: { type: GraphQLBoolean},
    value: { type: GraphQLString},
    placeholder: { type: GraphQLString},
    description: { type: GraphQLString},
    docUrl: { type: GraphQLString},
    clickToCopy: { type: GraphQLBoolean},
  }
})

export default fieldType;
