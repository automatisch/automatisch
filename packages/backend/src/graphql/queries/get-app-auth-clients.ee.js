import AppConfig from '../../models/app-config';

const getAppAuthClients = async (_parent, params, context) => {
  let canSeeAllClients = false;
  try {
    context.currentUser.can('read', 'App');

    canSeeAllClients = true;
  } catch {
    // void
  }

  const appConfig = await AppConfig.query()
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
      active: true,
    });
  }

  return await appAuthClients;
};

export default getAppAuthClients;
