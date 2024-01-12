// https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#feature-flag-events

export default {
  object_kind: 'feature_flag',
  project: {
    id: 1,
    name: 'Gitlab Test',
    description: 'Aut reprehenderit ut est.',
    web_url: 'http://example.com/gitlabhq/gitlab-test',
    avatar_url: null,
    git_ssh_url: 'git@example.com:gitlabhq/gitlab-test.git',
    git_http_url: 'http://example.com/gitlabhq/gitlab-test.git',
    namespace: 'GitlabHQ',
    visibility_level: 20,
    path_with_namespace: 'gitlabhq/gitlab-test',
    default_branch: 'master',
    ci_config_path: null,
    homepage: 'http://example.com/gitlabhq/gitlab-test',
    url: 'http://example.com/gitlabhq/gitlab-test.git',
    ssh_url: 'git@example.com:gitlabhq/gitlab-test.git',
    http_url: 'http://example.com/gitlabhq/gitlab-test.git',
  },
  user: {
    id: 1,
    name: 'Administrator',
    username: 'root',
    avatar_url:
      'https://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon',
    email: 'admin@example.com',
  },
  user_url: 'http://example.com/root',
  object_attributes: {
    id: 6,
    name: 'test-feature-flag',
    description: 'test-feature-flag-description',
    active: true,
  },
};
