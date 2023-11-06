import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty';
import defineTrigger from '../../../../helpers/define-trigger';
import appConfig from '../../../../config/app';

type Response = {
  data: {
    data: [
      {
        id: string;
      }
    ];
  };
};

export default defineTrigger({
  name: 'New live streams',
  key: 'newLiveStreams',
  type: 'webhook',
  description:
    'Triggers when a new live stream starts, regardless of the specific game or language it involves. To include a streamer you are not currently following, input the username of the streamer you want to add.',
  arguments: [
    {
      label: 'Broadcaster',
      key: 'broadcasterId',
      type: 'dropdown' as const,
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listBroadcasters',
          },
        ],
      },
    },
  ],

  async run($) {
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (!isEmpty(lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        },
      });
    }
  },

  async registerHook($) {
    const broadcasterId = $.step.parameters.broadcasterId as string;

    const payload = {
      type: 'stream.online',
      version: '1',
      condition: {
        broadcaster_user_id: broadcasterId,
      },
      transport: {
        method: 'webhook',
        callback: $.webhookUrl,
        secret: appConfig.webhookSecretKey,
      },
    };

    const response: Response = await $.http.post(
      '/helix/eventsub/subscriptions',
      payload,
      {
        additionalProperties: {
          appAccessToken: true,
        },
      }
    );

    await $.flow.setRemoteWebhookId(response.data.data[0].id);
  },

  async unregisterHook($) {
    const params = {
      id: $.flow.remoteWebhookId,
    };

    await $.http.delete('/helix/eventsub/subscriptions', {
      params,
      additionalProperties: {
        appAccessToken: true,
      },
    });
  },
});
