import SamlAuthProvider from '../models/saml-auth-provider.ee';
import User from '../models/user';
import Identity from '../models/identity.ee';

const getUser = (user: Record<string, unknown>, providerConfig: SamlAuthProvider) => ({
  name: user[providerConfig.firstnameAttributeName],
  surname: user[providerConfig.surnameAttributeName],
  id: user.nameID,
  email: user[providerConfig.emailAttributeName],
  role: user[providerConfig.roleAttributeName],
})

const findOrCreateUserBySamlIdentity = async (userIdentity: Record<string, unknown>, samlAuthProvider: SamlAuthProvider) => {
  const mappedUser = getUser(userIdentity, samlAuthProvider);
  const identity = await Identity.query().findOne({
    remote_id: mappedUser.id,
  });

  if (identity) {
    const user = await identity.$relatedQuery('user');

    return user;
  }

  const createdUser = await User.query().insertGraph({
    fullName: [
      mappedUser.name,
      mappedUser.surname
    ]
      .filter(Boolean)
      .join(' '),
    email: mappedUser.email as string,
    roleId: samlAuthProvider.defaultRoleId,
    identities: [
      {
        remoteId: mappedUser.id as string,
        providerId: samlAuthProvider.id,
        providerType: 'saml'
      }
    ]
  }, {
    relate: ['identities']
  }).returning('*');

  return createdUser;
};

export default findOrCreateUserBySamlIdentity;
