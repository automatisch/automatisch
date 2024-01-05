import confidentialIssueEvent from './confidential-issue-event/index.js';
import confidentialNoteEvent from './confidential-note-event/index.js';
import deploymentEvent from './deployment-event/index.js';
import featureFlagEvent from './feature-flag-event/index.js';
import issueEvent from './issue-event/index.js';
import jobEvent from './job-event/index.js';
import mergeRequestEvent from './merge-request-event/index.js';
import noteEvent from './note-event/index.js';
import pipelineEvent from './pipeline-event/index.js';
import pushEvent from './push-event/index.js';
import releaseEvent from './release-event/index.js';
import tagPushEvent from './tag-push-event/index.js';
import wikiPageEvent from './wiki-page-event/index.js';

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
