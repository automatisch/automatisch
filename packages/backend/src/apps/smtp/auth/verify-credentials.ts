import { IGlobalVariable } from '@automatisch/types';
import nodemailer, { TransportOptions } from 'nodemailer';

const verifyCredentials = async ($: IGlobalVariable) => {
  const client = nodemailer.createTransport({
    host: $.auth.data.host,
    port: $.auth.data.port,
    secure: $.auth.data.useTls,
    auth: {
      user: $.auth.data.username,
      pass: $.auth.data.password,
    },
  } as TransportOptions);

  await client.verify();

  await $.auth.set({
    screenName: $.auth.data.username,
  });
};

export default verifyCredentials;
