import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List devices',
  key: 'listDevices',

  async run($: IGlobalVariable) {
    const devices: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const { data } = await $.http.post(`/1/users/validate.json`, {
      token: $.auth.data.apiToken,
      user: $.auth.data.userKey,
    });

    if (!data?.devices?.length) {
      return;
    }

    for (const device of data.devices) {
      devices.data.push({
        value: device,
        name: device,
      });
    }

    return devices;
  },
};
