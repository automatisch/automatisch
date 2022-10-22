import { IActionOutput } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';

export default defineAction({
  name: 'Create issue',
  key: 'createIssue',
  description: 'Create a new issue.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseAction',
      name: 'Set up action',
      arguments: [
        {
          label: 'Repo',
          key: 'repo',
          type: 'dropdown',
          required: false,
          variables: false,
          source: {
            type: 'query',
            name: 'getData',
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
      ],
    },
    {
      key: 'testStep',
      name: 'Test action',
    },
  ],

  async run($) {
    const repoParameter = $.step.parameters.repo as string;
    const title = $.step.parameters.title as string;
    const body = $.step.parameters.body as string;

    if (!repoParameter) throw new Error('A repo must be set!');
    if (!title) throw new Error('A title must be set!');

    const { repoOwner, repo } = getRepoOwnerAndRepo(repoParameter);
    const response = await $.http.post(`/repos/${repoOwner}/${repo}/issues`, {
      title,
      body,
    });

    $.setActionItem({ raw: response.data });
  },
});
