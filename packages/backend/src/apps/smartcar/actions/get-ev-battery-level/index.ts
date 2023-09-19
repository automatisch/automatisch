import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Get EV Battery Level',
  key: 'getEvBatteryLevel',
  description: 'Get the battery level of an electric vehicle.',
  arguments: [
    {
      label: 'Vehicle',
      key: 'vehicle',
      type: 'dropdown' as const,
      required: true,
      description: 'The vehicle to get the location of.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listVehicles',
          },
        ],
      },
    },
  ],

  async run($) {
    const { vehicle } = $.step.parameters;
    const response = await $.http.get(
      `/vehicles/${vehicle}/battery?mode=simulated`
    );

    $.setActionItem({ raw: response.data });
  },
});
