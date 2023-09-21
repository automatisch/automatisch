import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Reverse Geocoding',
  key: 'reverseGeocoding',
  description: 'Get the address of a location from its longitude and latitude.',
  arguments: [
    {
      label: 'Longitude',
      key: 'longitude',
      type: 'string' as const,
      required: true,
      description: 'Longitude of the location.',
      variables: true,
    },
    {
      label: 'Latitude',
      key: 'latitude',
      type: 'string' as const,
      required: true,
      description: 'Latitude of the location.',
      variables: true,
    },
  ],

  async run($) {
    const response = await $.http.get(
      `/reverse?access_key=${$.auth.data.apiKey}&query=${$.step.parameters.longitude},${$.step.parameters.latitude}`
    );

    $.setActionItem({
      raw: response.data.data[0],
    });
  },
});
