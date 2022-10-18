import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../../common/get-current-user';
import getUserByUsername from '../../common/get-user-by-username';
import getUserFollowers from '../../common/get-user-followers';

const myFollowers = async ($: IGlobalVariable) => {
  const { username } = await getCurrentUser($);
  const user = await getUserByUsername($, username as string);

  const tweets = await getUserFollowers($, {
    userId: user.id,
  });
  return tweets;
};

export default myFollowers;
