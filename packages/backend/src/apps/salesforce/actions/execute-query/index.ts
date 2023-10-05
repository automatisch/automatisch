import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Execute query',
  key: 'executeQuery',
  description: 'Executes a SOQL query in Salesforce.',
  arguments: [
    {
      label: 'Query',
      key: 'query',
      type: 'string' as const,
      required: true,
      description:
        'Salesforce query string. For example: SELECT Id, Name FROM Account',
      variables: true,
    },
  ],

  async run($) {
    const query = $.step.parameters.query as string;

    const options = {
      params: {
        q: query,
      },
    };

    const { data } = await $.http.get('/services/data/v56.0/query', options);
    $.setActionItem({ raw: data });
  },
});
