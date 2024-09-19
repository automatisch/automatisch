import userSerializer from '../user.js';

const adminUserSerializer = (user) => {
  const userData = userSerializer(user);

  userData.acceptInvitationUrl = user.acceptInvitationUrl;

  return userData;
};

export default adminUserSerializer;
