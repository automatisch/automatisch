import defineAction from '../../../../helpers/define-action.js';
import isPlainObject from 'lodash/isPlainObject.js';

export default defineAction({
  name: 'Create waiter',
  key: 'createWaiter',
  description: 'Enqueues a waiter to the line with the selected line.',
  arguments: [
    {
      label: 'Line',
      key: 'lineId',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'The line to join',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLines',
          },
        ],
      },
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'string',
      required: true,
      variables: true,
      description:
        "The caller's phone number including country code (for example +4017111112233)",
    },
    {
      label: 'Channel',
      key: 'channel',
      type: 'dropdown',
      description:
        'Option describing if the waiter expects a callback or will receive a text message',
      required: true,
      variables: true,
      options: [
        { label: 'Call back', value: 'CallBack' },
        { label: 'Call in', value: 'CallIn' },
      ],
    },
    {
      label: 'Source',
      key: 'source',
      type: 'dropdown',
      description: 'Option describing the source where the caller came from',
      required: true,
      variables: true,
      options: [
        { label: 'Widget', value: 'Widget' },
        { label: 'Phone', value: 'Phone' },
        { label: 'Mobile', value: 'Mobile' },
        { label: 'App', value: 'App' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      label: 'Appointment',
      key: 'appointment',
      type: 'dropdown',
      required: true,
      variables: true,
      value: false,
      description:
        'If set to true, then this marks this as an appointment. If appointment_time is set, this is automatically set to true.',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listAppointmentFields',
          },
          {
            name: 'parameters.appointment',
            value: '{parameters.appointment}',
          },
        ],
      },
    },
    {
      label: 'Service phone to call',
      key: 'servicePhoneToCall',
      type: 'string',
      description:
        "If set, callback uses this number instead of the line's service phone number",
      required: false,
      variables: true,
    },
    {
      label: 'Properties',
      key: 'properties',
      type: 'string',
      required: false,
      variables: false,
      valueType: 'parse',
      description: 'JSON for the additional properties.',
      value: '{}',
    },
  ],
  async run($) {
    const {
      lineId,
      phone,
      channel,
      source,
      appointment,
      appointmentTime,
      servicePhoneToCall,
      properties = {},
    } = $.step.parameters;

    const body = {
      data: {
        type: 'waiters',
        attributes: {
          line_id: lineId,
          phone,
          channel,
          source,
          appointment,
          service_phone_to_call: servicePhoneToCall,
          properties,
        },
      },
    };

    if (appointment) {
      body.data.attributes.appointmentTime = appointmentTime;
    }

    if (!isPlainObject(properties)) {
      throw new Error(
        `The "properties" field must have a valid JSON. The current value: ${properties}`
      );
    }

    const { data } = await $.http.post('/v2/waiters', body);

    $.setActionItem({ raw: data });
  },
});
