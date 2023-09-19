import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Get Vehicle Location',
  key: 'getVehicleLocation',
  description: 'Get the location of a vehicle',

  async run($) {
    const response = await $.http.get(
      `https://sandbox.rest-api.high-mobility.com/v5/vehicle_location`
    );

    $.setActionItem({ raw: response.data });
  },
});
