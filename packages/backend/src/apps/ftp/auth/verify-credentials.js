import { Client } from 'basic-ftp';

const verifyCredentials = async ($) => {
  const client = new Client();
  client.ftp.verbose = true;

  await client.access({
    host: $.auth.data.host,
    user: $.auth.data.username,
    password: $.auth.data.password,
    secure: $.auth.data.secure,
  });

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
