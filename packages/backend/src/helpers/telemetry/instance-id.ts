import Crypto from 'crypto';

const instanceId = () => {
  return Crypto.randomUUID();
};

export default instanceId;
