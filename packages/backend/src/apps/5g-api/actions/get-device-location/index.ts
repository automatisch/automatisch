import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Get Device Location',
  key: 'getDeviceLocation',
  description: 'Get the location of the device.',
  arguments: [
    {
      label: 'MSISDN',
      key: 'msisdn',
      type: 'string' as const,
      required: true,
      description:
        'Subscriber number in E.164 format (starting with country code). Optionally prefixed with ' +
        '.',
      variables: true,
    },
    {
      label: 'Latitude',
      key: 'latitude',
      type: 'string' as const,
      required: true,
      description: 'Latitude component of location',
      variables: true,
    },
    {
      label: 'Longitude',
      key: 'longitude',
      type: 'string' as const,
      required: true,
      description: 'Longitude component of location',
      variables: true,
    },
    {
      label: 'Accuracy',
      key: 'accuracy',
      type: 'string' as const,
      required: true,
      description: 'Accuracy expected for location verification in km',
      variables: true,
    },
  ],

  async run($) {
    const payload = {
      ueId: {
        msisdn: $.step.parameters.msisdn,
      },
      latitude: $.step.parameters.latitude,
      longitude: $.step.parameters.longitude,
      accuracy: $.step.parameters.accuracy,
    };

    const response = await $.http.post(
      'https://api-eu.vonage.com/camara/location/v0/verify',
      payload
    );

    $.setActionItem({ raw: response.data });
  },
});
