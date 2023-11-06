import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import getCurrentUser from '../../common/get-current-user';

export default {
  name: 'List broadcasters',
  key: 'listBroadcasters',

  async run($: IGlobalVariable) {
    const Broadcasters: {
      data: IJSONObject[];
    } = {
      data: [],
    };
    const currentUser = await getCurrentUser($);

    const params = {
      user_id: currentUser.id,
    };

    const { data } = await $.http.get('/helix/channels/followed', { params });

    if (data.data?.length) {
      for (const broadcaster of data.data) {
        Broadcasters.data.push({
          value: broadcaster.broadcaster_id,
          name: broadcaster.broadcaster_name,
        });
      }
    }

    return Broadcasters;
  },
};
