import defineAction from '../../../../helpers/define-action';
import findMessage from './find-message';

export default defineAction({
  name: 'Find a message',
  key: 'findMessage',
  description: 'Finds a message using the Slack feature.',
  arguments: [
    {
      label: 'Search Query',
      key: 'query',
      type: 'string' as const,
      required: true,
      description:
        'Search query to use for finding matching messages. See the Slack Search Documentation for more information on constructing a query.',
      variables: true,
    },
    {
      label: 'Sort by',
      key: 'sortBy',
      type: 'dropdown' as const,
      description:
        'Sort messages by their match strength or by their date. Default is score.',
      required: true,
      value: 'score',
      variables: true,
      options: [
        {
          label: 'Match strength',
          value: 'score',
        },
        {
          label: 'Message date time',
          value: 'timestamp',
        },
      ],
    },
    {
      label: 'Sort direction',
      key: 'sortDirection',
      type: 'dropdown' as const,
      description:
        'Sort matching messages in ascending or descending order. Default is descending.',
      required: true,
      value: 'desc',
      variables: true,
      options: [
        {
          label: 'Descending (newest or best match first)',
          value: 'desc',
        },
        {
          label: 'Ascending (oldest or worst match first)',
          value: 'asc',
        },
      ],
    },
  ],

  async run($) {
    const parameters = $.step.parameters;
    const query = parameters.query as string;
    const sortBy = parameters.sortBy as string;
    const sortDirection = parameters.sortDirection as string;
    const count = 1;

    const messages = await findMessage($, {
      query,
      sortBy,
      sortDirection,
      count,
    });

    return messages;
  },
});
