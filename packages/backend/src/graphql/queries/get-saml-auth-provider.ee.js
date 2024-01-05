import SamlAuthProvider from '../../models/saml-auth-provider.ee.js';

const getSamlAuthProvider = async (_parent, params, context) => {
  context.currentUser.can('read', 'SamlAuthProvider');

  const samlAuthProvider = await SamlAuthProvider.query()
    .limit(1)
    .first()
    .throwIfNotFound();

  return samlAuthProvider;
};

export default getSamlAuthProvider;
