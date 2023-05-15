export enum GITLAB_EVENT_TYPE {
  // ref: https://docs.gitlab.com/ee/api/projects.html#add-project-hook
  confidential_issues_events = 'confidential_issues_events',
  confidential_note_events = 'confidential_note_events',
  deployment_events = 'deployment_events',
  feature_flag_events = 'feature_flag_events',
  issues_events = 'issues_events',
  job_events = 'job_events',
  merge_requests_events = 'merge_requests_events',
  note_events = 'note_events',
  pipeline_events = 'pipeline_events',
  push_events = 'push_events',
  releases_events = 'releases_events',
  tag_push_events = 'tag_push_events',
  wiki_page_events = 'wiki_page_events',
}

export type EventDescriptor = {
  name: string;
  description: string;
  info?: string;
  type: GITLAB_EVENT_TYPE;
  data: any;
};
