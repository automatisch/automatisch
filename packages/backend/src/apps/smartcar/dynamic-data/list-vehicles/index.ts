import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List vehicles',
  key: 'listVehicles',

  async run($: IGlobalVariable) {
    const vehicles: {
      data: IJSONObject[];
      error: IJSONObject | null;
    } = {
      data: [],
      error: null,
    };

    const response: any = await $.http.get('/vehicles');

    for (const vehicle of response.data.vehicles) {
      const response: any = await $.http.get(`/vehicles/${vehicle}`);

      const vehicleName = `${response.data.make} - ${response.data.model} (${response.data.year})`;

      vehicles.data.push({
        value: vehicle as string,
        name: vehicleName,
      });
    }

    return vehicles;
  },
};
