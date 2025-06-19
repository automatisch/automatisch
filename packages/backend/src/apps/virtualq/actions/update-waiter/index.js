import defineAction from '../../../../helpers/define-action.js';
import isPlainObject from 'lodash/isPlainObject.js';

export default defineAction({
  name: 'Update waiter',
  key: 'updateWaiter',
  description: 'Updates a waiter to the line with the selected line.',
  arguments: [
    {
      label: 'Waiter',
      key: 'waiterId',
      type: 'dropdown',
      required: true,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listWaiters',
          },
        ],
      },
    },
    {
      label: 'Line',
      key: 'lineId',
      type: 'dropdown',
      required: false,
      variables: true,
      description: 'Used to find caller if 0 is used for waiter field',
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
      required: false,
      variables: true,
      description: 'Used to find caller if 0 is used for waiter field',
    },
    {
      label: 'Estimated waiting time',
      key: 'serviceWaiterEwt',
      type: 'string',
      description: 'EWT as calculated by the service',
      required: false,
      variables: true,
    },
    {
      label: 'State',
      key: 'serviceWaiterState',
      type: 'dropdown',
      description: 'State of caller in the call center',
      required: false,
      variables: true,
      options: [
        { label: 'Waiting', value: 'Waiting' },
        { label: 'Connected', value: 'Connected' },
        { label: 'Transferred', value: 'Transferred' },
        { label: 'Timeout', value: 'Timeout' },
        { label: 'Canceled', value: 'Canceled' },
      ],
    },
    {
      label: 'Wait time',
      key: 'waitTimeWhenUp',
      type: 'string',
      description: 'Wait time in seconds before being transferred to agent',
      required: false,
      variables: true,
    },
    {
      label: 'Talk time',
      key: 'talkTime',
      type: 'string',
      description: 'Time in seconds spent talking with Agent',
      required: false,
      variables: true,
    },
    {
      label: 'Agent',
      key: 'agentId',
      type: 'string',
      description: 'Agent where call was transferred to',
      required: false,
      variables: true,
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
    },
  ],

  async run($) {
    const {
      waiterId,
      lineId,
      phone,
      serviceWaiterEwt,
      serviceWaiterState,
      waitTimeWhenUp,
      talkTime,
      agentId,
      servicePhoneToCall,
      properties,
    } = $.step.parameters;

    const body = {
      data: {
        type: 'waiters',
        attributes: {
          line_id: lineId,
          phone,
          service_phone_to_call: servicePhoneToCall,
        },
      },
    };

    if (serviceWaiterEwt) {
      body.data.attributes.service_waiter_ewt = serviceWaiterEwt;
    }

    if (serviceWaiterState) {
      body.data.attributes.service_waiter_state = serviceWaiterState;
    }

    if (talkTime) {
      body.data.attributes.talk_time = talkTime;
    }

    if (agentId) {
      body.data.attributes.agent_id = agentId;
    }

    if (waitTimeWhenUp) {
      body.data.attributes.wait_time_when_up = waitTimeWhenUp;
    }

    if (properties) {
      if (!isPlainObject(properties)) {
        throw new Error(
          `The "properties" field must have a valid JSON. The current value: ${properties}`
        );
      }

      body.data.attributes.properties = properties;
    }

    const { data } = await $.http.put(`/v2/waiters/${waiterId}`, body);

    $.setActionItem({ raw: data });
  },
});
