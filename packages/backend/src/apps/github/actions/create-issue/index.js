import defineAction from '../../../../helpers/define-action.js';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo.js';

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
  ],

  async run($) {
    const repoParameter = $.step.parameters.repo;
    const title = $.step.parameters.title;
    const body = $.step.parameters.body;

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
