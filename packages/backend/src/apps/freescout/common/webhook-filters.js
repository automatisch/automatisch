const webhookFilters = [
  {
    value: 'convo.assigned',
    label: 'Conversation assigned',
  },
  {
    value: 'convo.created',
    label: 'Conversation created',
  },
  {
    value: 'convo.deleted',
    label: 'Conversation deleted',
  },
  {
    value: 'convo.deleted_forever',
    label: 'Conversation deleted forever',
  },
  {
    value: 'convo.restored',
    label: 'Conversation restored from Deleted folder',
  },
  {
    value: 'convo.moved',
    label: 'Conversation moved',
  },
  {
    value: 'convo.status',
    label: 'Conversation status updated',
  },
  {
    value: 'convo.customer.reply.created',
    label: 'Customer replied',
  },
  {
    value: 'convo.agent.reply.created',
    label: 'Agent replied',
  },
  {
    value: 'convo.note.created',
    label: 'Note added',
  },
  {
    value: 'customer.created',
    label: 'Customer created',
  },
  {
    value: 'customer.updated',
    label: 'Customer updated',
  },
];

export default webhookFilters;
