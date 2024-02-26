import crypto from 'crypto';

const verifyCredentials = async ($) => {
  const params = {
    operation: 'getchallenge',
    username: $.auth.data.username,
  };

  const { data } = await $.http.get('/webservice.php', { params });

  const accessKey = crypto
    .createHash('md5')
    .update(data.result.token + $.auth.data.accessKey)
    .digest('hex');

  const body = {
    operation: 'login',
    username: $.auth.data.username,
    accessKey,
  };

  const { data: result } = await $.http.post('/webservice.php', body);

  const response = await $.http.get('/restapi/v1/vtiger/default/me');

  await $.auth.set({
    screenName: `${response.data.result?.first_name} ${response.data.result?.last_name}`,
    sessionName: result.result.sessionName,
  });
};

export default verifyCredentials;
