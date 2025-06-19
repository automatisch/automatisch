import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create issue',
  key: 'createIssue',
  description: 'Creates a new issue.',
  arguments: [
    {
      label: 'Repo',
      key: 'repo',
      type: 'dropdown',
      required: true,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listRepos',
          },
        ],
      },
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: true,
      variables: true,
    },
    {
      label: 'Labels',
      key: 'labels',
      type: 'dynamic',
      required: false,
      fields: [
        {
          label: 'Label',
          key: 'label',
          type: 'dropdown',
          description: 'Only trigger on issues when this label is added.',
          required: false,
          variables: true,
          dependsOn: ['parameters.repo'],
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listLabels',
              },
              {
                name: 'parameters.repo',
                value: '{parameters.repo}',
              },
              {
                name: 'parameters.showLabelId',
                value: 'true',
              },
            ],
          },
        },
      ],
    },
  ],

  async run($) {
    const repoOwner = $.auth.data.repoOwner;
    const repo = $.step.parameters.repo;
    const title = $.step.parameters.title;
    const issueBody = $.step.parameters.body;
    const allLabels = $.step.parameters.labels;
    const formattedAllLabels = allLabels
      .filter((label) => label.label !== '')
      .map((label) => label.label);

    const body = {
      title,
      body: issueBody,
    };

    if (formattedAllLabels.length) {
      body.labels = formattedAllLabels;
    }

    const response = await $.http.post(
      `/repos/${repoOwner}/${repo}/issues`,
      body
    );

    $.setActionItem({ raw: response.data });
  },
});
