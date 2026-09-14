import HttpError from '../../../../errors/http.js';
import getPaginatedItems from '../../common/get-paginated-items.js';

const isNotAnOrganization = (error) =>
  error instanceof HttpError && [403, 404].includes(error.response?.status);

export default {
  name: 'List sender profiles',
  key: 'listSenderProfiles',

  async run($) {
    let profiles;

    try {
      profiles = await getPaginatedItems($, '/v3/sender-profiles', {
        itemsKey: 'sender_profiles',
      });
    } catch (error) {
      // Only organization accounts have sender profiles.
      if (isNotAnOrganization(error)) return { data: [] };

      throw error;
    }

    return {
      data: profiles.map((profile) => ({
        value: profile.id,
        name: profile.short_name
          ? `${profile.name} (${profile.short_name})`
          : profile.name,
      })),
    };
  },
};
