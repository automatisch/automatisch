export const MESSAGE_EVENT_FAMILY = 'message';
export const TEMPLATES_EVENT_FAMILY = 'templates';

const messageEventLabels = {
  queued: 'Message queued',
  routed: 'Message routed',
  sent: 'Message sent',
  delivered: 'Message delivered',
  read: 'Message read',
  failed: 'Message failed',
  scheduled: 'Message scheduled',
  filtered: 'Message filtered',
  blocked: 'Message blocked',
  received: 'Message received (inbound)',
};

export const MESSAGE_EVENT_SUBTYPES = Object.keys(messageEventLabels);

export const eventTypeOptions = [
  { label: 'All message events', value: MESSAGE_EVENT_FAMILY },
  ...MESSAGE_EVENT_SUBTYPES.map((subtype) => ({
    label: messageEventLabels[subtype],
    value: `${MESSAGE_EVENT_FAMILY}.${subtype}`,
  })),
  { label: 'Template status events', value: TEMPLATES_EVENT_FAMILY },
];

const supportedEventValues = eventTypeOptions.map((option) => option.value);

/**
 * Translates the selected event values into Sent's subscription model:
 * `event_types` lists event families and `event_filters` narrows a family
 * to sub-type suffixes.
 */
export const buildWebhookSubscription = (selectedEvents) => {
  const eventTypes = new Set();
  const messageFilters = new Set();
  let allMessageEvents = false;

  for (const value of selectedEvents) {
    if (!supportedEventValues.includes(value)) {
      throw new Error(`Unsupported Sent event type "${value}".`);
    }

    if (value === MESSAGE_EVENT_FAMILY) {
      allMessageEvents = true;
      eventTypes.add(MESSAGE_EVENT_FAMILY);
    } else if (value === TEMPLATES_EVENT_FAMILY) {
      eventTypes.add(TEMPLATES_EVENT_FAMILY);
    } else {
      eventTypes.add(MESSAGE_EVENT_FAMILY);
      messageFilters.add(value.slice(MESSAGE_EVENT_FAMILY.length + 1));
    }
  }

  if (eventTypes.size === 0) {
    throw new Error('Select at least one Sent event type.');
  }

  const eventFamilies = [MESSAGE_EVENT_FAMILY, TEMPLATES_EVENT_FAMILY].filter(
    (family) => eventTypes.has(family)
  );

  const subscription = { event_types: eventFamilies };

  if (!allMessageEvents && messageFilters.size > 0) {
    subscription.event_filters = {
      [MESSAGE_EVENT_FAMILY]: [...messageFilters],
    };
  }

  return subscription;
};
