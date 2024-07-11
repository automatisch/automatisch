import issueCreate from './issues/create.js';
import issueDelete from './issues/delete.js';
import issueGet from './issues/get.js';
import issueList from './issues/list.js';
import issueUpdate from './issues/update.js';
import snippetsCreate from './snippets/create.js';
import snippetsDelete from './snippets/delete.js';
import snippetsGet from './snippets/get.js';
import snippetsList from './snippets/list.js';
import snippetsUpdate from './snippets/update.js';
import mergeRequestCreate from './merge-request/create.js';
import mergeRequestDelete from './merge-request/delete.js';
import mergeRequestGet from './merge-request/get.js';
import mergeRequestList from './merge-request/list.js';
import mergeRequestUpdate from './merge-request/update.js';

export default [
  issueCreate,
  issueDelete,
  issueGet,
  issueList,
  issueUpdate,
  snippetsCreate,
  snippetsDelete,
  snippetsGet,
  snippetsList,
  snippetsUpdate,
  mergeRequestCreate,
  mergeRequestDelete,
  mergeRequestGet,
  mergeRequestList,
  mergeRequestUpdate,
];
