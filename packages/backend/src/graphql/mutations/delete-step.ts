import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Step from '../../models/step';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string;
};

const deleteStepResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  await req.currentUser
    .$relatedQuery('steps')
    .delete()
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  return;
};

const deleteStep = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    deleteStepResolver(params, req),
};

export default deleteStep;
