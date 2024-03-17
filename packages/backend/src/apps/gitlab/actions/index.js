import issueCreate from './issues/create.js';
import issueUpdate from './issues/update.js';
import issueList from './issues/list.js';
import issueGet from './issues/get.js';
import issueLinkCreate from './issue-links/create.js';
import issueLinkDelete from './issue-links/delete.js';
import issueLinkList from './issue-links/list.js';
import notes from './notes/index.js';

export default [
  issueCreate,
  issueGet,
  issueLinkCreate,
  issueLinkDelete,
  issueLinkList,
  issueList,
  issueUpdate,
  ...notes,
];
