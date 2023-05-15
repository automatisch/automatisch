import confidentialIssueEvent from './confidential-issue-event';
import confidentialNoteEvent from './confidential-note-event';
import deploymentEvent from './deployment-event';
import featureFlagEvent from './feature-flag-event';
import issueEvent from './issue-event';
import jobEvent from './job-event';
import mergeRequestEvent from './merge-request-event';
import noteEvent from './note-event';
import pipelineEvent from './pipeline-event';
import pushEvent from './push-event';
import releaseEvent from './release-event';
import tagPushEvent from './tag-push-event';
import wikiPageEvent from './wiki-page-event';

export default [
  confidentialIssueEvent,
  confidentialNoteEvent,
  deploymentEvent,
  featureFlagEvent,
  issueEvent,
  jobEvent,
  mergeRequestEvent,
  noteEvent,
  pipelineEvent,
  pushEvent,
  releaseEvent,
  tagPushEvent,
  wikiPageEvent,
];
