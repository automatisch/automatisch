import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New folders',
  key: 'newFolder',
  type: 'webhook',
  description: 'Triggers when a new folder is created.',
  arguments: [
    {
      label: 'Workspace',
      key: 'workspaceId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listWorkspaces',
          },
        ],
      },
    },
    {
      label: 'Space',
      key: 'spaceId',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.workspaceId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSpaces',
          },
          {
            name: 'parameters.workspaceId',
            value: '{parameters.workspaceId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: $.request.body.folder_id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const sampleEventData = {
      event: 'folderCreated',
      folder_id: '90180382912',
      webhook_id: Crypto.randomUUID(),
    };

    const dataItem = {
      raw: sampleEventData,
      meta: {
        internalId: '',
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const { workspaceId, spaceId } = $.step.parameters;

    const payload = {
      name: $.flow.id,
      endpoint: $.webhookUrl,
      events: ['folderCreated'],
    };

    if (spaceId) {
      payload.space_id = spaceId;
    }

    const { data } = await $.http.post(
      `/v2/team/${workspaceId}/webhook`,
      payload
    );

    await $.flow.setRemoteWebhookId(data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/v2/webhook/${$.flow.remoteWebhookId}`);
  },
});
