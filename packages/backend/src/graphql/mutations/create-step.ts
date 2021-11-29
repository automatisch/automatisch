import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLEnumType } from 'graphql';
import Step from '../../models/step';
import Flow from '../../models/flow';
import stepType from '../types/step';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  flowId: number,
  key: string,
  appKey: string,
  type: string
  connectionId: number
}

const createStepResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const flow = await Flow.query().findOne({
    id: params.flowId,
    user_id: req.currentUser.id
  });

  const step = await Step.query().insertAndFetch({
    flowId: flow.id,
    key: params.key,
    appKey: params.appKey,
    type: params.type,
    connectionId: params.connectionId,
  });

  return step;
}

const createStep = {
  type: stepType,
  args: {
    flowId: { type: GraphQLNonNull(GraphQLString) },
    key: { type: GraphQLNonNull(GraphQLString) },
    appKey: { type: GraphQLNonNull(GraphQLString) },
    type: {
      type: new GraphQLEnumType({
        name: 'StepInputEnumType',
        values: {
          trigger: { value: 'trigger' },
          action: { value: 'action' },
        }
      })
    },
    connectionId: { type: GraphQLNonNull(GraphQLInt) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => createStepResolver(params, req)
};

export default createStep;
