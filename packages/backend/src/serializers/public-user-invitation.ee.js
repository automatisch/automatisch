import roleSerializer from './role.js';

const publicUserInvitationSerializer = (user) => {
  let userData = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
    status: user.status,
    fullName: user.fullName,
    acceptInvitationUrl: user.acceptInvitationUrl,
  };

  if (user.role) {
    userData.role = roleSerializer(user.role);
  }

  return userData;
};

export default publicUserInvitationSerializer;
