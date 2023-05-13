import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type TMember = {
  id: string;
  profile: {
    real_name_normalized: string;
  };
}

type TUserListResponseData = {
  members: TMember[],
  response_metadata?: {
    next_cursor: string
  };
  needed?: string;
  error?: string;
  ok: boolean;
}

type TResponse = {
  data: TUserListResponseData;
}

export default {
  name: 'List users',
  key: 'listUsers',

  async run($: IGlobalVariable) {
    const users: {
      data: IJSONObject[];
      error: IJSONObject | null;
    } = {
      data: [],
      error: null,
    };

    let nextCursor;
    do {
      const response: TResponse = await $.http.get('/users.list', {
        params: {
          cursor: nextCursor,
          limit: 1000,
        }
      });

      nextCursor = response.data.response_metadata?.next_cursor;

      if (response.data.error === 'missing_scope') {
        throw new Error(`Missing "${response.data.needed}" scope while authorizing. Please, reconnect your connection!`);
      }

      if (response.data.ok === false) {
        throw new Error(JSON.stringify(response.data, null, 2));
      }

      for (const member of response.data.members) {
        users.data.push({
          value: member.id as string,
          name: member.profile.real_name_normalized as string,
        });
      }
    } while (nextCursor);

    return users;
  },
};
