import getCurrentUser from '../../common/get-current-user.js';
import getUserByUsername from '../../common/get-user-by-username.js';
import getUserFollowers from '../../common/get-user-followers.js';

const myFollowers = async ($) => {
  const { username } = await getCurrentUser($);
  const user = await getUserByUsername($, username);

  const tweets = await getUserFollowers($, {
    userId: user.id,
  });
  return tweets;
};

export default myFollowers;
