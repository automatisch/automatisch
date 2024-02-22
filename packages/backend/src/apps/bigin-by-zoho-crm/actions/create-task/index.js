import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create task',
  key: 'createTask',
  description: 'Creates a new task.',
  arguments: [
    {
      label: 'Task Owner',
      key: 'taskOwnerId',
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
            value: 'listContactOwners',
          },
        ],
      },
    },
    {
      label: 'Subject',
      key: 'subject',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Due Date',
      key: 'dueDate',
      type: 'string',
      required: true,
      description: 'The date format is yyyy-mm-dd.',
      variables: true,
    },
    {
      label: 'Frequency (Recurring Activity)',
      key: 'frequency',
      type: 'dropdown',
      required: false,
      description:
        'Specifies the frequency of event recurrence. The options include DAILY, WEEKLY, MONTHLY, or YEARLY.',
      variables: true,
      options: [
        { label: 'None', value: 'NONE' },
        { label: 'Daily Events', value: 'DAILY' },
        { label: 'Weekly Events', value: 'WEEKLY' },
        { label: 'Monthly Events', value: 'MONTHLY' },
      ],
    },
    {
      label: 'Interval (Recurring Activity)',
      key: 'interval',
      type: 'string',
      required: false,
      description:
        'Specifies the time difference between individual events. The INTERVAL can be anywhere from 1 to 99. For instance, with a WEEKLY event set at an INTERVAL of 2, there will be a two-week gap between each occurrence.',
      variables: true,
    },
    {
      label: 'Start Date (Recurring Activity)',
      key: 'startDate',
      type: 'string',
      required: false,
      description: 'The date format is yyyy-mm-dd.',
      variables: true,
    },
    {
      label: 'By Month Day (Recurring Activity)',
      key: 'byMonthDay',
      type: 'string',
      required: false,
      description:
        'This specifies the date within the month when the event recurs. The BYMONTHDAY value can be any number from 1 to 31. This rule applies exclusively to events that repeat monthly or yearly.',
      variables: true,
    },
    {
      label: 'By Week (Recurring Activity)',
      key: 'byWeek',
      type: 'dropdown',
      required: false,
      description:
        'Only relevant for events that occur on a monthly or yearly basis.',
      variables: true,
      options: [
        { label: 'First week of the month', value: '1' },
        { label: 'Second week of the month', value: '2' },
        { label: 'Third week of the month', value: '3' },
        { label: 'Fourth week of the month', value: '4' },
        { label: 'Last week of the month', value: '-1' },
      ],
    },
    {
      label: 'By Day (Recurring Activity)',
      key: 'byDay',
      type: 'dropdown',
      required: false,
      description:
        'This signifies the weekday when the event recurs. This rule applies to events that repeat daily, weekly, monthly, and yearly (should not be combined with INTERVAL).',
      variables: true,
      options: [
        { label: 'Sunday', value: 'SU' },
        { label: 'Monday', value: 'MO' },
        { label: 'Tuesday', value: 'TU' },
        { label: 'Wednesday', value: 'WE' },
        { label: 'Thursday', value: 'TH' },
        { label: 'Friday', value: 'FR' },
        { label: 'Saturday', value: 'SA' },
      ],
    },
    {
      label: 'Count (Recurring Activity)',
      key: 'count',
      type: 'string',
      required: false,
      description:
        'Specifies the number of events you wish to generate. The count value range from 1 to 99.',
      variables: true,
    },
    {
      label: 'Until (Recurring Activity)',
      key: 'until',
      type: 'string',
      required: false,
      description:
        'Specifies the concluding date for the event recurrence. Please input the date in the YYYY-MM-DD format.',
      variables: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Priority',
      key: 'priority',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'High', value: 'High' },
        { label: 'Normal', value: 'Normal' },
      ],
    },
    {
      label: 'Status',
      key: 'status',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
      ],
    },
    {
      label: 'Tags',
      key: 'tags',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Tag',
          key: 'tag',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    const {
      taskOwnerId,
      subject,
      dueDate,
      frequency,
      startDate,
      interval,
      byMonthDay,
      byDay,
      byWeek,
      count,
      until,
      description,
      priority,
      status,
      tags,
    } = $.step.parameters;

    const allTags = tags.map((tag) => ({
      name: tag.tag,
    }));

    let rrule;
    if (frequency) rrule += `FREQ=${frequency};`;
    if (interval) rrule += `INTERVAL=${interval};`;
    if (count) rrule += `COUNT=${count};`;
    if (byMonthDay) rrule += `BYMONTHDAY=${byMonthDay};`;
    if (byDay) rrule += `BYDAY=${byDay};`;
    if (byWeek) rrule += `BYSETPOS=${byWeek};`;
    if (until) rrule += `UNTIL=${until};`;
    if (startDate) rrule += `DTSTART=${startDate}`;

    const body = {
      data: [
        {
          Owner: {
            id: taskOwnerId,
          },
          Subject: subject,
          Due_Date: dueDate,
          Description: description,
          Priority: priority,
          Status: status,
          Tag: allTags,
        },
      ],
    };

    if (rrule) {
      body.data[0].Recurring_Activity = {
        RRULE: rrule,
      };
    }

    const { data } = await $.http.post(`/bigin/v2/Tasks`, body);

    $.setActionItem({
      raw: data,
    });
  },
});
