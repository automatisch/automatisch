import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New tasks',
  key: 'newTasks',
  type: 'webhook',
  description: 'Triggers when a new task is created.',
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
      label: 'Task',
      key: 'taskId',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.listId'],
      description:
        'Choose an optional task to determine when this flow should be activated. In this scenario, only subtasks will initiate this flow.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTasks',
          },
          {
            name: 'parameters.listId',
            value: '{parameters.listId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: $.request.body.task_id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const sampleEventData = {
      event: 'taskCreated',
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
    const { workspaceId, spaceId, folderId, listId, taskId } =
      $.step.parameters;

    const payload = {
      name: $.flow.id,
      endpoint: $.webhookUrl,
      events: ['taskCreated'],
      space_id: spaceId,
    };

    if (folderId) {
      payload.folder_id = folderId;
    }

    if (listId) {
      payload.list_id = listId;
    }

    if (taskId) {
      payload.task_id = taskId;
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
