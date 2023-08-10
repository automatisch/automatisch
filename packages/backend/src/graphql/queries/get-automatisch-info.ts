import appConfig from '../../config/app';
import { getLicense } from '../../helpers/license.ee';

const getAutomatischInfo = async () => {
  const license = await getLicense();

  const computedLicense = {
    id: license ? license.id : null,
    name: license ? license.name : null,
    expireAt: license ? license.expireAt : null,
    verified: license ? true : false,
  };

  return {
    isCloud: appConfig.isCloud,
    license: computedLicense,
  };
};

export default getAutomatischInfo;
