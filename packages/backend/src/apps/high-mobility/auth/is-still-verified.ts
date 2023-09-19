import { IGlobalVariable } from '@automatisch/types';
import getVehicleInfo from '../common/get-vehicle-info';

const isStillVerified = async ($: IGlobalVariable) => {
  const user = await getVehicleInfo($);
  return !!user;
};

export default isStillVerified;
