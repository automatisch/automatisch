import AppConfig from '../../models/app-config';
import Context from '../../types/express/context';

type Params = {
  appKey: string;
  active: boolean;
};

const getAppAuthClients = async (_parent: unknown, params: Params, context: Context) => {
  let canSeeAllClients = false;
  try {
    context.currentUser.can('read', 'App');

    canSeeAllClients = true;
  } catch {
    // void
  }

  const appConfig = await AppConfig
    .query()
    .findOne({
      key: params.appKey,
    })
    .throwIfNotFound();

  const appAuthClients = appConfig
    .$relatedQuery('appAuthClients')
    .where({ active: params.active })
    .skipUndefined();

  if (!canSeeAllClients) {
    appAuthClients.where({
      active: true
    })
  }

  return await appAuthClients;
};

export default getAppAuthClients;
