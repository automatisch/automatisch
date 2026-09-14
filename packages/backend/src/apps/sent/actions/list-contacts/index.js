import defineAction from '../../../../helpers/define-action.js';
import HttpError from '../../../../errors/http.js';
import getProfileHeaders from '../../common/get-profile-headers.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';
import { MAX_PAGE_SIZE } from '../../common/get-paginated-items.js';
import {
  parsePhoneNumbers,
  parsePositiveInteger,
} from '../../common/validators.js';

const DEFAULT_PAGE_SIZE = 20;

const buildEmptyPage = (page, pageSize, meta) => ({
  success: true,
  data: {
    contacts: [],
    pagination: {
      page,
      page_size: pageSize,
      total_count: 0,
      total_pages: 0,
      has_more: false,
      cursors: null,
    },
  },
  error: null,
  meta: meta ?? null,
});

export default defineAction({
  name: 'List contacts',
  key: 'listContacts',
  description:
    'Retrieves one page of contacts, optionally filtered by search term, phone number or channel.',
  arguments: [
    senderProfileArgument,
    {
      label: 'Search',
      key: 'search',
      type: 'string',
      required: false,
      description: 'Optional search term.',
      variables: true,
    },
    {
      label: 'Phone Number',
      key: 'phone',
      type: 'string',
      required: false,
      description:
        'Optional. Only return the contact with this phone number (E.164 format).',
      variables: true,
    },
    {
      label: 'Channel',
      key: 'channel',
      type: 'dropdown',
      required: false,
      description: 'Optional channel filter.',
      variables: false,
      value: '',
      options: [
        { label: 'Any', value: '' },
        { label: 'SMS', value: 'sms' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
    },
    {
      label: 'Page',
      key: 'page',
      type: 'string',
      required: false,
      description: 'Page number, starting at 1.',
      variables: true,
      value: '1',
    },
    {
      label: 'Page Size',
      key: 'pageSize',
      type: 'string',
      required: false,
      description: `Contacts per page, between 1 and ${MAX_PAGE_SIZE}.`,
      variables: true,
      value: String(DEFAULT_PAGE_SIZE),
    },
  ],

  async run($) {
    const parameters = $.step.parameters;
    const page = parsePositiveInteger(parameters.page, 'Page', { fallback: 1 });
    const pageSize = parsePositiveInteger(parameters.pageSize, 'Page size', {
      max: MAX_PAGE_SIZE,
      fallback: DEFAULT_PAGE_SIZE,
    });

    const params = { page, page_size: pageSize };

    if (parameters.search?.trim()) params.search = parameters.search.trim();
    if (parameters.channel) params.channel = parameters.channel;

    if (parameters.phone?.trim()) {
      [params.phone] = parsePhoneNumbers(parameters.phone, 'Phone number');
    }

    const headers = getProfileHeaders(parameters.senderProfileId);

    try {
      const response = await $.http.get('/v3/contacts', { params, headers });

      $.setActionItem({ raw: response.data });
    } catch (error) {
      // Sent answers a phone-number filter without a match with
      // 404 RESOURCE_001 (contact not found) instead of an empty page;
      // a list step should return an empty page instead.
      const isPhoneFilterMiss =
        error instanceof HttpError &&
        error.response?.status === 404 &&
        error.details?.error?.code === 'RESOURCE_001' &&
        params.phone;

      if (!isPhoneFilterMiss) throw error;

      $.setActionItem({
        raw: buildEmptyPage(page, pageSize, error.details?.meta),
      });
    }
  },
});
