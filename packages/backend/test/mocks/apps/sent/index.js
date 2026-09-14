export const SENT_API_URL = 'https://api.sent.dm';
export const TEST_API_KEY = 'test-sent-api-key';

// 32 zero bytes, base64-encoded, prefixed the way Sent issues secrets.
export const TEST_SIGNING_SECRET =
  'whsec_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
export const OTHER_SIGNING_SECRET =
  'whsec_AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyA=';

export const meta = {
  request_id: 'req_7X9zKp2jDw',
  timestamp: '2026-01-15T10:30:00+00:00',
  version: 'v3',
};

export const envelope = (data) => ({ success: true, data, error: null, meta });

export const errorEnvelope = (code, message, details = null) => ({
  success: false,
  data: null,
  error: {
    code,
    message,
    details,
    doc_url: 'https://docs.sent.dm/reference/api/error-catalog',
  },
  meta,
});

export const pagination = (page, pageSize, totalCount) => ({
  page,
  page_size: pageSize,
  total_count: totalCount,
  total_pages: Math.ceil(totalCount / pageSize),
  has_more: page * pageSize < totalCount,
  cursors: null,
});

export const account = {
  type: 'organization',
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  organization_id: null,
  name: 'Acme Corporation',
  short_name: null,
  email: 'ops@acme.example',
  icon: null,
  description: null,
  created_at: '2025-01-20T14:00:00+00:00',
  channels: {
    sms: { configured: true, phone_number: '+14155550100' },
    whatsapp: { configured: false },
    rcs: { configured: false },
  },
  sending_phone_number: '+14155550100',
  sending_phone_number_profile_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  status: null,
  settings: null,
  profiles: [
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Marketing Team',
      short_name: 'MKT',
    },
  ],
};

export const sendMessageResponse = {
  status: 'QUEUED',
  template_id: null,
  template_name: 'FREE_TEXT_SYS_TEMPLATE',
  recipients: [
    {
      message_id: '8ba7b830-9dad-11d1-80b4-00c04fd430c8',
      to: '+14155550100',
      channel: 'sms',
      body: 'Hello from Automatisch',
    },
  ],
};

export const message = {
  id: '8ba7b830-9dad-11d1-80b4-00c04fd430c8',
  customer_id: '550e8400-e29b-41d4-a716-446655440000',
  contact_id: '550e8400-e29b-41d4-a716-446655440002',
  phone: '+14155550100',
  phone_international: '+1 415-555-0100',
  region_code: 'US',
  template_id: null,
  template_name: 'FREE_TEXT_SYS_TEMPLATE',
  template_category: null,
  channel: 'sms',
  message_body: {
    header: null,
    content: 'Hello from Automatisch',
    footer: null,
    buttons: null,
  },
  status: 'DELIVERED',
  direction: 'OUTBOUND',
  created_at: '2026-01-15T10:30:00+00:00',
  price: 0.04,
  active_contact_price: 0.015,
  events: [
    {
      status: 'DELIVERED',
      timestamp: '2026-01-15T10:30:10+00:00',
      description: 'Message updated to DELIVERED',
    },
    {
      status: 'SENT',
      timestamp: '2026-01-15T10:30:05+00:00',
      description: 'Message sent via SMS',
    },
    {
      status: 'QUEUED',
      timestamp: '2026-01-15T10:30:00+00:00',
      description: 'Message queued for sending',
    },
  ],
};

export const messageActivities = {
  message_id: '8ba7b830-9dad-11d1-80b4-00c04fd430c8',
  activities: [
    {
      status: 'DELIVERED',
      description: 'Message delivered to recipient',
      from: '+14155550101',
      timestamp: '2026-01-15T10:30:10+00:00',
      price: '0.0400',
      active_contact_price: '0.0150',
    },
    {
      status: 'SENT',
      description: 'Message sent via SMS',
      from: '+14155550101',
      timestamp: '2026-01-15T10:30:05+00:00',
      price: '0.0400',
      active_contact_price: '0.0150',
    },
    {
      status: 'QUEUED',
      description: 'Message accepted and queued for processing',
      from: null,
      timestamp: '2026-01-15T10:30:00+00:00',
      price: null,
      active_contact_price: null,
    },
  ],
  pagination: pagination(1, 20, 3),
};

export const contact = {
  id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  customer_id: '550e8400-e29b-41d4-a716-446655440000',
  phone_number: '+14155550100',
  format_e164: '+14155550100',
  format_international: '+1 415-555-0100',
  format_national: '(415) 555-0100',
  format_rfc: 'tel:+1-415-555-0100',
  country_code: '1',
  region_code: 'US',
  available_channels: 'sms,whatsapp',
  default_channel: 'sms',
  opt_out: false,
  is_inherited: false,
  created_at: '2026-01-15T10:30:00+00:00',
  updated_at: null,
};

export const phoneNumberDetails = {
  phone_number: '+14155550100',
  is_valid: true,
  carrier_name: 'T-Mobile',
  line_type: 'mobile',
  country_code: 'US',
  mobile_country_code: '310',
  mobile_network_code: '260',
  is_ported: false,
  is_voip: false,
};

export const template = {
  id: '7ba7b820-9dad-11d1-80b4-00c04fd430c8',
  customer_id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Order confirmation',
  category: 'UTILITY',
  language: 'en_US',
  status: 'APPROVED',
  channels: ['sms', 'whatsapp'],
  variables: ['customerName', 'orderNumber'],
  created_at: '2026-01-15T10:30:00+00:00',
  updated_at: null,
  is_published: true,
};

export const senderProfile = {
  id: '660e8400-e29b-41d4-a716-446655440001',
  organization_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Marketing Team',
  short_name: 'MKT',
  description: null,
  api_key: null,
  created_at: '2026-01-15T10:30:00+00:00',
};

export const webhook = (overrides = {}) => ({
  id: 'd4f5a6b7-c8d9-4e0f-a1b2-c3d4e5f6a7b8',
  customer_id: '550e8400-e29b-41d4-a716-446655440000',
  display_name: 'Automatisch (flow)',
  endpoint_url: 'http://localhost:3000/webhooks/flows/flow-id',
  signing_secret: TEST_SIGNING_SECRET,
  is_active: true,
  event_types: ['message'],
  event_filters: { message: ['received'] },
  retry_count: 3,
  timeout_seconds: 30,
  last_delivery_attempt_at: null,
  last_successful_delivery_at: null,
  consecutive_failures: 0,
  created_at: '2026-01-15T10:30:00+00:00',
  updated_at: null,
  ...overrides,
});

export {
  sampleInboundMessageEvent as inboundMessageEvent,
  sampleOutboundMessageEvent as deliveredMessageEvent,
} from '../../../../src/apps/sent/common/sample-events.js';

export const templateEvent = {
  field: 'templates',
  timestamp: '2026-01-15T12:15:42Z',
  payload: {
    account_id: '7ba7b820-9dad-11d1-80b4-00c04fd430c8',
    template_id: '9ba7b840-9dad-11d1-80b4-00c04fd430c8',
    whatsapp_template_id: '1234567890',
    template_name: 'order_confirmation',
    status: 'APPROVED',
    language: 'en_US',
    category: 'UTILITY',
    channel: 'whatsapp',
    reason: null,
  },
};
