import Flow from '@/models/flow.js';
import appConfig from '@/config/app.js';

export const checkIsQuotaExceeded = async (request, response, next) => {
  if (!appConfig.isCloud) {
    next();

    return;
  }

  const { flowId } = request.params;

  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const user = await flow.$relatedQuery('user');

  const testRun = !flow.active;
  const quotaExceeded = !testRun && !(await user.isAllowedToRunFlows());

  if (quotaExceeded) {
    return response.status(422).end();
  }

  next();
};
