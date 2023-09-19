import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const getVehicleInfo = async ($: IGlobalVariable): Promise<IJSONObject> => {
  const response = await $.http.get(
    'https://sandbox.api.high-mobility.com/v1/vehicleinfo'
  );

  const currentVehicle = response.data;

  return currentVehicle;
};

export default getVehicleInfo;
