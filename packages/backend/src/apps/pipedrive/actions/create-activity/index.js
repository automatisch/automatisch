import defineAction from '../../../../helpers/define-action.js';
import { filterProvidedFields } from '../../common/filter-provided-fields.js';

export default defineAction({
  name: 'Create activity',
  key: 'createActivity',
  description: 'Creates a new activity.',
  arguments: [
    {
      label: 'Subject',
      key: 'subject',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listOrganizations',
          },
        ],
      },
    },
    {
      label: 'Assigned To',
      key: 'userId',
      type: 'dropdown',
      required: false,
      description:
        'If omitted, the activity will be assigned to the user of the connected account.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listUsers',
          },
        ],
      },
    },
    {
      label: 'Person',
      key: 'personId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listPersons',
          },
        ],
      },
    },
    {
      label: 'Deal',
      key: 'dealId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDeals',
          },
        ],
      },
    },
    {
      label: 'Is done?',
      key: 'isDone',
      type: 'dropdown',
      required: false,
      description: '',
      options: [
        {
          label: 'No',
          value: 0,
        },
        {
          label: 'Yes',
          value: 1,
        },
      ],
    },
    {
      label: 'Type',
      key: 'type',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listActivityTypes',
          },
        ],
      },
    },
    {
      label: 'Due Date',
      key: 'dueDate',
      type: 'string',
      required: false,
      description: 'Format must be YYYY-MM-DD',
      variables: true,
    },
    {
      label: 'Due Time',
      key: 'dueTime',
      type: 'string',
      required: false,
      description: 'Format must be HH:MM',
      variables: true,
    },
    {
      label: 'Duration',
      key: 'duration',
      type: 'string',
      required: false,
      description: 'Format must be HH:MM',
      variables: true,
    },
    {
      label: 'Note',
      key: 'note',
      type: 'string',
      required: false,
      description: 'Accepts HTML format',
      variables: true,
    },
  ],

  async run($) {
    const {
      subject,
      organizationId,
      userId,
      personId,
      dealId,
      isDone,
      type,
      dueTime,
      dueDate,
      duration,
      note,
    } = $.step.parameters;

    const fields = {
      subject: subject,
      org_id: organizationId,
      user_id: userId,
      person_id: personId,
      deal_id: dealId,
      done: isDone,
      type: type,
      due_time: dueTime,
      due_date: dueDate,
      duration: duration,
      note: note,
    };

    const body = filterProvidedFields(fields);

    const {
      data: { data },
    } = await $.http.post('/api/v1/activities', body);

    $.setActionItem({
      raw: data,
    });
  },
});
