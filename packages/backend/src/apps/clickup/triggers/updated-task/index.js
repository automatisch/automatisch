import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Updated task',
  key: 'updatedTask',
  type: 'webhook',
  description: 'Triggers when a task is updated.',
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
    {
      label: 'List',
      key: 'listId',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.folderId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLists',
          },
          {
            name: 'parameters.folderId',
            value: '{parameters.folderId}',
          },
        ],
      },
    },
    {
      label: 'What Changed?',
      key: 'whatChanged',
      type: 'dropdown',
      required: false,
      variables: true,
      options: [
        { label: 'Status', value: 'taskStatusUpdated' },
        { label: 'Assignee Added', value: 'taskAssigneeUpdated' },
        { label: 'Priority', value: 'taskPriorityUpdated' },
        { label: 'Tag Added', value: 'taskTagUpdated' },
      ],
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
    const sampleEventData = {
      event: 'taskUpdated',
      task_id: '86enn7pg7',
      webhook_id: Crypto.randomUUID(),
      history_items: [],
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
    const { workspaceId, spaceId, folderId, listId, whatChanged } =
      $.step.parameters;

    const payload = {
      name: $.flow.id,
      endpoint: $.webhookUrl,
      space_id: spaceId,
    };

    payload.events = [whatChanged || 'taskUpdated'];

    if (folderId) {
      payload.folder_id = folderId;
    }

    if (listId) {
      payload.list_id = listId;
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
