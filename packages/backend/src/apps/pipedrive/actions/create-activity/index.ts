import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';

export default defineAction({
  name: 'Create activity',
  key: 'createActivity',
  description: 'Creates a new activity.',
  arguments: [
    {
      label: 'Subject',
      key: 'subject',
      type: 'string' as const,
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown' as const,
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
      type: 'dropdown' as const,
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
      type: 'dropdown' as const,
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
      type: 'dropdown' as const,
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
      type: 'dropdown' as const,
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
      type: 'dropdown' as const,
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
      type: 'string' as const,
      required: false,
      description: 'Format must be YYYY-MM-DD',
      variables: true,
    },
    {
      label: 'Due Time',
      key: 'dueTime',
      type: 'string' as const,
      required: false,
      description: 'Format must be HH:MM',
      variables: true,
    },
    {
      label: 'Duration',
      key: 'duration',
      type: 'string' as const,
      required: false,
      description: 'Format must be HH:MM',
      variables: true,
    },
    {
      label: 'Note',
      key: 'note',
      type: 'string' as const,
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
      subject: subject as string,
      org_id: organizationId as number,
      user_id: userId as number,
      person_id: personId as number,
      deal_id: dealId as number,
      done: isDone as number,
      type: type as string,
      due_time: dueTime as string,
      due_date: dueDate as string,
      duration: duration as string,
      note: note as string,
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
