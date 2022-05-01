import CryptoJS from 'crypto-js';
import appConfig from '../../config/app';

const organizationId = () => {
  const key = appConfig.encryptionKey;
  const hash = CryptoJS.SHA3(key, { outputLength: 256 }).toString(
    CryptoJS.enc.Hex
  );

  return hash;
};

export default organizationId;
