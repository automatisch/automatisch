import { IGlobalVariable } from '@automatisch/types';
import { imapClient } from '../common/imapClient';

const verifyCredentials = async ($: IGlobalVariable) => {
  const imapEmails = imapClient($);

  await imapEmails.connect();

  await $.auth.set({
    screenName: $.auth.data.email,
  });
};

export default verifyCredentials;
