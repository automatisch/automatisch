import { IGlobalVariable } from '@automatisch/types';
import transporter from '../common/transporter';

const verifyCredentials = async ($: IGlobalVariable) => {
  await transporter($).verify();

  await $.auth.set({
    screenName: $.auth.data.username,
  });
};

export default verifyCredentials;
