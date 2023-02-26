import checkLicense from '../../helpers/check-license.ee';

const getLicense = async () => {
  const license = await checkLicense();

  return {
    type: license ? 'ee' : 'ce',
  };
};

export default getLicense;
