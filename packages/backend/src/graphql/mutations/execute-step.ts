import { GraphQLString, GraphQLNonNull } from 'graphql';
import App from '../../models/app';
import Connection from '../../models/connection';
import Step from '../../models/step';
import stepType from '../types/step';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string,
  data: object
}
const executeStepResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let step = await Step.query().findOne({
    id: params.id
  }).throwIfNotFound();

  let connection = await Connection.query().findOne({
    id: step.connectionId
  }).throwIfNotFound();

  const appClass = (await import(`../../apps/${step.appKey}`)).default;
  const appInstance = new appClass(connection.data);
  await appInstance.triggers[step.key].run();

  return step;
}

const executeStep = {
  type: stepType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => executeStepResolver(params, req)
};

export default executeStep;
