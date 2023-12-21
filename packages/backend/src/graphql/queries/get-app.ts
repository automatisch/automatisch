import App from '../../models/app';
import Connection from '../../models/connection';
import Context from '../../types/express/context';

type Params = {
  key: string;
};

const getApp = async (_parent: unknown, params: Params, context: Context) => {
  const conditions = context.currentUser.can('read', 'Connection');

  const app = await App.findOneByKey(params.key);

  if (context.currentUser) {
    const userConnections = context.currentUser.relatedConnectionsQuery();
    const allConnections = Connection.query();
    const connectionBaseQuery = conditions.isCreator ? userConnections : allConnections;

    const connections = await Connection.query()
      .with('connections', connectionBaseQuery)
      .with(
        'connections_with_flow_count',
        Connection.query()
          .clearSelect()
          .select('connections.id')
          .leftJoinRelated('steps')
          .leftJoin('flows', function () {
            this
              .on(
                'flows.id',
                '=',
                'steps.flow_id',
              )

            if (conditions.isCreator) {
              this.andOnVal(
                'flows.user_id',
                '=',
                context.currentUser.id
              )
            }
          })
          .where({
            'connections.key': params.key,
            'connections.draft': false,
          })
          .countDistinct('steps.flow_id as flowCount')
          .groupBy('connections.id')
      )
      .select(
        'connections.*',
        'connections_with_flow_count.flowCount as flowCount'
      )
      .from('connections')
      .withGraphFetched({
        appConfig: true,
        appAuthClient: true
      })
      .joinRaw('join connections_with_flow_count on connections.id = connections_with_flow_count.id')
      .orderBy('connections.created_at', 'desc');

    return {
      ...app,
      connections,
    };
  }

  return app;
};

export default getApp;
