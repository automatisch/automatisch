import conversationAgentReplyCreated from './conversation-agent-reply-created/index.js';
import conversationAssigned from './conversation-assigned/index.js';
import conversationCreated from './conversation-created/index.js';
import conversationCustomerReplyCreated from './conversation-customer-reply-created/index.js';
import conversationDeleted from './conversation-deleted/index.js';
import conversationDeletedForever from './conversation-deleted-forever/index.js';
import conversationMoved from './conversation-moved/index.js';
import conversationNoteCreated from './conversation-note-created/index.js';
import conversationRestored from './conversation-restored/index.js';
import conversationStatus from './conversation-status/index.js';
import customerCreated from './customer-created/index.js';
import customerUpdated from './customer-updated/index.js';

export default [
  conversationAgentReplyCreated,
  conversationAssigned,
  conversationCreated,
  conversationCustomerReplyCreated,
  conversationDeleted,
  conversationDeletedForever,
  conversationMoved,
  conversationNoteCreated,
  conversationRestored,
  conversationStatus,
  customerCreated,
  customerUpdated,
];
