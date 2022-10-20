import { IGlobalVariable } from '@automatisch/types';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

const oauthClient = ($: IGlobalVariable) => {
  const consumerData = {
    key: $.auth.data.consumerKey as string,
    secret: $.auth.data.consumerSecret as string,
  };

  return new OAuth({
    consumer: consumerData,
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    },
  });
};

export default oauthClient;
