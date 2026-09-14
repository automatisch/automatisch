export const sampleInboundMessageEvent = {
  field: 'message',
  event: 'message.received',
  timestamp: '2026-01-15T10:10:42Z',
  payload: {
    message_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    updated_at: '2026-01-15T10:10:40Z',
    account_id: '7ba7b820-9dad-11d1-80b4-00c04fd430c8',
    inbound_number: '+14155550100',
    outbound_number: '+14155550101',
    text: 'Hello, I have a question about my order',
    channel: 'sms',
    received_at: '2026-01-15T10:10:40Z',
  },
};

export const sampleOutboundMessageEvent = {
  field: 'message',
  event: 'message.delivered',
  timestamp: '2026-01-15T12:15:42Z',
  payload: {
    updated_at: '2026-01-15T12:15:42Z',
    account_id: '7ba7b820-9dad-11d1-80b4-00c04fd430c8',
    message_id: '8ba7b830-9dad-11d1-80b4-00c04fd430c8',
    template_id: '9ba7b840-9dad-11d1-80b4-00c04fd430c8',
    template_name: 'order_confirmation',
    outbound_number: '+14155550100',
    message_status: 'DELIVERED',
    channel: 'sms',
  },
};
