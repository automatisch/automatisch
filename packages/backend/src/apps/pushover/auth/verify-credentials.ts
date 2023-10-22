import { IGlobalVariable } from '@automatisch/types';
import HttpError from '../../../errors/http';

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    await $.http.post(`/1/users/validate.json`, {
      token: $.auth.data.apiToken as string,
      user: $.auth.data.userKey as string,
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
