import { GraphQLEnumType } from 'graphql';

const argumentEnumValues = {
  integer: { value: 'integer' },
  string: { value: 'string' }
}

const ArgumentEnumType = new GraphQLEnumType({
  name: 'ArgumentEnumType',
  values: argumentEnumValues
})

export default ArgumentEnumType;
