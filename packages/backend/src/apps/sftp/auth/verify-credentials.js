import Client from 'ssh2-sftp-client';

const verifyCredentials = async ($) => {
  const sftpClient = new Client();

  try {
    await sftpClient.connect({
      host: $.auth.data.host,
      port: $.auth.data.port,
      username: $.auth.data.username,
      password: $.auth.data.password,
    });
  } catch (err) {
    console.log(err);
  }

  await sftpClient.end();
  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
