import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create event',
  key: 'createEvent',
  description: 'Creates a new event.',
  arguments: [
    {
      label: 'Host',
      key: 'hostId',
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
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'From',
      key: 'from',
      type: 'string',
      required: true,
      description: 'The date format is ISO8601 (yyyy-mm-ddTHH:mm:ssZ).',
      variables: true,
    },
    {
      label: 'To',
      key: 'to',
      type: 'string',
      required: true,
      description: 'The date format is ISO8601 (yyyy-mm-ddTHH:mm:ssZ).',
      variables: true,
    },
    {
      label: 'All Day',
      key: 'allDay',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
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
      type: 'string',
      required: false,
      description:
        'This signifies the weekday when the event recurs. The options include SU, MO, TU, WE, TH, FR, or SA. This rule applies to events that repeat daily, weekly, monthly, and yearly (should not be combined with INTERVAL).',
      variables: true,
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
      label: 'Reminder',
      key: 'reminder',
      type: 'dropdown',
      required: false,
      description:
        'Provide the reminder list to notify or prompt participants prior to the event.',
      variables: true,
      options: [
        { label: '5 min', value: '5 minutes' },
        { label: '10 min', value: '10 minutes' },
        { label: '15 min', value: '15 minutes' },
        { label: '1 hrs', value: '1 hours' },
        { label: '2 hrs', value: '2 hours' },
        { label: '1 days', value: '1 days' },
        { label: '2 days', value: '2 days' },
        { label: '1 weeks', value: '1 weeks' },
      ],
    },
    {
      label: 'Location',
      key: 'location',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Related Module',
      key: 'relatedModule',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'Companies', value: 'Accounts' },
        { label: 'Contacts', value: 'Contacts' },
        { label: 'Deals', value: 'Deals' },
      ],
    },
    {
      label: 'Participants',
      key: 'participants',
      type: 'dynamic',
      required: false,
      description: 'Email Address of participants.',
      fields: [
        {
          label: 'Participant',
          key: 'participant',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
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
      hostId,
      title,
      from,
      to,
      allDay,
      frequency,
      interval,
      byMonthDay,
      byDay,
      byWeek,
      count,
      until,
      reminder,
      location,
      relatedModule,
      participants,
      description,
      tags,
    } = $.step.parameters;

    const allTags = tags.map((tag) => ({
      name: tag.tag,
    }));

    const allParticipants = participants.map((participant) => ({
      type: 'email',
      participant: participant.participant,
    }));

    const [unit, period] = reminder.split(' ');

    let rrule = `FREQ=${frequency};INTERVAL=${interval};`;
    if (count) rrule += `COUNT=${count};`;
    if (byMonthDay) rrule += `BYMONTHDAY=${byMonthDay};`;
    if (byDay) rrule += `BYDAY=${byDay};`;
    if (byWeek) rrule += `BYSETPOS=${byWeek};`;
    if (until) rrule += `UNTIL=${until};`;

    const body = {
      data: [
        {
          Owner: {
            id: hostId,
          },
          Event_Title: title,
          Start_DateTime: from,
          End_DateTime: to,
          All_day: allDay,
          $se_module: relatedModule,
          Recurring_Activity: {
            RRULE: rrule,
          },
          Remind_At: [
            {
              unit: Number(unit),
              period,
            },
          ],
          Venue: location,
          Participants: allParticipants,
          Description: description,
          Tag: allTags,
        },
      ],
    };

    const { data } = await $.http.post(`/bigin/v2/Events`, body);

    $.setActionItem({
      raw: data,
    });
  },
});
