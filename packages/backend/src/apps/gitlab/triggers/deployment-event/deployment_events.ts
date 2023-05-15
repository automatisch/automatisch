// https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#deployment-events

export default {
  object_kind: 'deployment',
  status: 'success',
  status_changed_at: '2021-04-28 21:50:00 +0200',
  deployment_id: 15,
  deployable_id: 796,
  deployable_url:
    'http://10.126.0.2:3000/root/test-deployment-webhooks/-/jobs/796',
  environment: 'staging',
  environment_slug: 'staging',
  environment_external_url: 'https://staging.example.com',
  project: {
    id: 30,
    name: 'test-deployment-webhooks',
    description: '',
    web_url: 'http://10.126.0.2:3000/root/test-deployment-webhooks',
    avatar_url: null,
    git_ssh_url: 'ssh://vlad@10.126.0.2:2222/root/test-deployment-webhooks.git',
    git_http_url: 'http://10.126.0.2:3000/root/test-deployment-webhooks.git',
    namespace: 'Administrator',
    visibility_level: 0,
    path_with_namespace: 'root/test-deployment-webhooks',
    default_branch: 'master',
    ci_config_path: '',
    homepage: 'http://10.126.0.2:3000/root/test-deployment-webhooks',
    url: 'ssh://vlad@10.126.0.2:2222/root/test-deployment-webhooks.git',
    ssh_url: 'ssh://vlad@10.126.0.2:2222/root/test-deployment-webhooks.git',
    http_url: 'http://10.126.0.2:3000/root/test-deployment-webhooks.git',
  },
  short_sha: '279484c0',
  user: {
    id: 1,
    name: 'Administrator',
    username: 'root',
    avatar_url:
      'https://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon',
    email: 'admin@example.com',
  },
  user_url: 'http://10.126.0.2:3000/root',
  commit_url:
    'http://10.126.0.2:3000/root/test-deployment-webhooks/-/commit/279484c09fbe69ededfced8c1bb6e6d24616b468',
  commit_title: 'Add new file',
};
