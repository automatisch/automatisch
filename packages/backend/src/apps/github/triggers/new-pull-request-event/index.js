import defineTrigger from '../../../../helpers/define-trigger.js';
import * as Crypto from 'node:crypto';
import appConfig from '../../../../config/app.js';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo.js';

export default defineTrigger({
  name: 'New pull request event',
  key: 'newPullRequestEvent',
  type: 'webhook',
  description: 'Triggers on pull request webhook events',
  arguments: [
    {
      label: 'Repository',
      key: 'repo',
      type: 'dropdown',
      required: true,
      variables: false,
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
  ],

  async run($) {
    const webhookPayload = $.request.body;

    $.pushTriggerItem({
      raw: webhookPayload,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    });
  },

  async testRun($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (lastExecutionStep?.dataOut) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: Crypto.randomUUID(),
        },
      });
      return;
    }

    const sampleData = {
      action: 'opened',
      number: 1,
      pull_request: {
        id: 1,
        number: 1,
        title: 'Sample Pull Request',
        body: 'This is a sample pull request for testing purposes.',
        state: 'open',
        merged: false,
        user: {
          login: 'sampleuser',
          id: 1,
          avatar_url: 'https://avatars.githubusercontent.com/u/9919',
          type: 'User',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        head: {
          ref: 'feature-branch',
          sha: 'abc123',
          repo: {
            full_name: 'owner/repo',
            name: 'repo',
          },
        },
        base: {
          ref: 'main',
          sha: 'def456',
          repo: {
            full_name: 'owner/repo',
            name: 'repo',
          },
        },
      },
      repository: {
        id: 1,
        name: 'repo',
        full_name: 'owner/repo',
        owner: {
          login: 'owner',
          id: 1,
        },
      },
    };

    $.pushTriggerItem({
      raw: sampleData,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    });
  },

  async registerHook($) {
    const { repoOwner, repo } = getRepoOwnerAndRepo($.step.parameters.repo);

    const subscriptionPayload = {
      name: 'web',
      active: true,
      events: ['pull_request'],
      config: {
        url: $.webhookUrl,
        content_type: 'json',
        secret: appConfig.webhookSecretKey,
        insecure_ssl: 0,
      },
    };

    const { data } = await $.http.post(
      `/repos/${repoOwner}/${repo}/hooks`,
      subscriptionPayload
    );

    await $.flow.setRemoteWebhookId(data.id.toString());
  },

  async unregisterHook($) {
    const { repoOwner, repo } = getRepoOwnerAndRepo($.step.parameters.repo);

    await $.http.delete(
      `/repos/${repoOwner}/${repo}/hooks/${$.flow.remoteWebhookId}`
    );
  },
});
