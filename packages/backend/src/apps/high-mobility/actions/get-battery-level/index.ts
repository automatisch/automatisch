import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Get Battery Level',
  key: 'getBatteryLevel',
  description: 'Get the battery level of a vehicle',

  async run($) {
    const response = await $.http.get(
      `https://sandbox.rest-api.high-mobility.com/v5/charging`
    );

    $.setActionItem({
      raw: {
        batteryLevel: response.data.batteryLevel.data,
        estimatedRange: response.data.estimatedRange.data,
      },
    });
  },
});
