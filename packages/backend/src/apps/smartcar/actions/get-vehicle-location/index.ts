import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Get Vehicle Location',
  key: 'getVehicleLocation',
  description: 'Get the location of a vehicle',
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
      `/vehicles/${vehicle}/location?mode=simulated`
    );

    $.setActionItem({ raw: response.data });
  },
});
