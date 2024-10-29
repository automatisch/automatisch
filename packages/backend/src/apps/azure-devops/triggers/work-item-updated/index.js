import defineTrigger from '../../../../helpers/define-trigger.js';
import sampleData from './sample-data.js';

export default defineTrigger({
  name: 'Work item updated',
  key: 'workItemUpdated',
  type: 'webhook',
  description: 'Triggers when a work item is updated.',
  arguments: [
    {
      label: 'Project',
      key: 'project',
      type: 'dropdown',
      required: true,
      description: 'The name of the Azure DevOps project.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listProjects',
          },
        ],
      },
    },
    {
      label: 'Event Type',
      key: 'eventType',
      type: 'dropdown',
      required: true,
      description: 'Select which event type to trigger on.',
      options: [
        { label: 'New', value: 'workitem.created' },
        { label: 'Updated', value: 'workitem.updated' },
        { label: 'Deleted', value: 'workitem.deleted' },
        { label: 'Restored', value: 'workitem.restored' },
      ],
    },
  ],

  async run($) {
    const updatedFields = {};
    for (const key in $.request.body.resource.fields) {
      const newKey = key.replace(/\./g, '__');
      updatedFields[newKey] = $.request.body.resource.fields[key];
    }
    $.request.body.resource.fields = updatedFields;
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: $.request.body.id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const sampleEventData = sampleData[$.step.parameters.eventType];

    const dataItem = {
      raw: sampleEventData,
      meta: {
        internalId: sampleEventData.id,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const { project, workItemType } = $.step.parameters;

    const payload = {
      publisherId: 'tfs',
      eventType: $.step.parameters.eventType,
      resourceVersion: '1.0',
      consumerId: 'webHooks',
      consumerActionId: 'httpRequest',
      publisherInputs: {
        projectId: project,
        workItemType: workItemType,
      },
      consumerInputs: {
        url: $.webhookUrl,
      },
    };

    const { data } = await $.http.post(`/_apis/hooks/subscriptions`, payload);

    await $.flow.setRemoteWebhookId(data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/_apis/hooks/subscriptions/${$.flow.remoteWebhookId}`);
  },
});
