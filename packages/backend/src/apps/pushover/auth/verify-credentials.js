import HttpError from '../../../errors/http.js';

const verifyCredentials = async ($) => {
  try {
    await $.http.post(`/1/users/validate.json`, {
      token: $.auth.data.apiToken,
      user: $.auth.data.userKey,
    });
  } catch (error) {
    const noDeviceError = 'user is valid but has no active devices';
    const hasNoDeviceError =
      error.response?.data?.errors?.includes(noDeviceError);

    if (!hasNoDeviceError) {
      throw new HttpError(error);
    }
  }

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
