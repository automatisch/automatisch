import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New lists',
  key: 'newLists',
  type: 'webhook',
  description: 'Triggers when a new list is created.',
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
    {
      label: 'Folder',
      key: 'folderId',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.spaceId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFolders',
          },
          {
            name: 'parameters.spaceId',
            value: '{parameters.spaceId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: $.request.body.list_id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const sampleEventData = {
      event: 'listCreated',
      list_id: '901800588812',
      webhook_id: Crypto.randomUUID(),
    };

    const dataItem = {
      raw: sampleEventData,
      meta: {
        internalId: sampleEventData.webhook_id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const { workspaceId, spaceId, folderId } = $.step.parameters;

    const payload = {
      name: $.flow.id,
      endpoint: $.webhookUrl,
      events: ['listCreated'],
      space_id: spaceId,
    };

    if (folderId) {
      payload.folder_id = folderId;
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
