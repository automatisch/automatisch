// https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#wiki-page-events

export default {
  object_kind: 'wiki_page',
  user: {
    id: 1,
    name: 'Administrator',
    username: 'root',
    avatar_url:
      'http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80\u0026d=identicon',
    email: 'admin@example.com',
  },
  project: {
    id: 1,
    name: 'awesome-project',
    description: 'This is awesome',
    web_url: 'http://example.com/root/awesome-project',
    avatar_url: null,
    git_ssh_url: 'git@example.com:root/awesome-project.git',
    git_http_url: 'http://example.com/root/awesome-project.git',
    namespace: 'root',
    visibility_level: 0,
    path_with_namespace: 'root/awesome-project',
    default_branch: 'master',
    homepage: 'http://example.com/root/awesome-project',
    url: 'git@example.com:root/awesome-project.git',
    ssh_url: 'git@example.com:root/awesome-project.git',
    http_url: 'http://example.com/root/awesome-project.git',
  },
  wiki: {
    web_url: 'http://example.com/root/awesome-project/-/wikis/home',
    git_ssh_url: 'git@example.com:root/awesome-project.wiki.git',
    git_http_url: 'http://example.com/root/awesome-project.wiki.git',
    path_with_namespace: 'root/awesome-project.wiki',
    default_branch: 'master',
  },
  object_attributes: {
    title: 'Awesome',
    content: 'awesome content goes here',
    format: 'markdown',
    message: 'adding an awesome page to the wiki',
    slug: 'awesome',
    url: 'http://example.com/root/awesome-project/-/wikis/awesome',
    action: 'create',
    diff_url:
      'http://example.com/root/awesome-project/-/wikis/home/diff?version_id=78ee4a6705abfbff4f4132c6646dbaae9c8fb6ec',
  },
};
