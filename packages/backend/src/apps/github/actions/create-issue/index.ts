import defineAction from '../../../../helpers/define-action';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';

export default defineAction({
  name: 'Create issue',
  key: 'createIssue',
  description: 'Creates a new issue.',
  arguments: [
    {
      label: 'Repo',
      key: 'repo',
      type: 'dropdown' as const,
      required: false,
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
      type: 'string' as const,
      required: true,
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string' as const,
      required: true,
      variables: true,
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
