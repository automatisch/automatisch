import { GraphQLString, GraphQLNonNull } from 'graphql';
import Connection from '../../models/connection';
import Step from '../../models/step';
import stepType from '../types/step';

type Params = {
  id: string;
  data: Record<string, unknown>;
};
const executeStepResolver = async (params: Params): Promise<any> => {
  const step = await Step.query()
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  const connection = await Connection.query()
    .findOne({
      id: step.connectionId,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${step.appKey}`)).default;
  const appInstance = new appClass(connection.data);
  await appInstance.triggers[step.key].run();

  return step;
};

const executeStep = {
  type: stepType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params) => executeStepResolver(params),
};

export default executeStep;
