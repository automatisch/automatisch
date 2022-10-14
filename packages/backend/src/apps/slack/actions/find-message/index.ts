import { IGlobalVariable } from '@automatisch/types';
import findMessage from './find-message';

export default {
  name: 'Find message',
  key: 'findMessage',
  description: 'Find a Slack message using the Slack Search feature.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'setupAction',
      name: 'Set up action',
      arguments: [
        {
          label: 'Search Query',
          key: 'query',
          type: 'string',
          required: true,
          description:
            'Search query to use for finding matching messages. See the Slack Search Documentation for more information on constructing a query.',
          variables: true,
        },
        {
          label: 'Sort by',
          key: 'sortBy',
          type: 'dropdown',
          description:
            'Sort messages by their match strength or by their date. Default is score.',
          required: true,
          value: 'score',
          variables: false,
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
          type: 'dropdown',
          description:
            'Sort matching messages in ascending or descending order. Default is descending.',
          required: true,
          value: 'desc',
          variables: false,
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
    },
    {
      key: 'testStep',
      name: 'Test action',
    },
  ],

  async run($: IGlobalVariable) {
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
};
