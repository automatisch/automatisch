import SamlAuthProvider from '../../models/saml-auth-provider.ee.js';

const upsertSamlAuthProvider = async (_parent, params, context) => {
  context.currentUser.can('create', 'SamlAuthProvider');

  const samlAuthProviderPayload = {
    ...params.input,
  };

  const existingSamlAuthProvider = await SamlAuthProvider.query()
    .limit(1)
    .first();

  if (!existingSamlAuthProvider) {
    const samlAuthProvider = await SamlAuthProvider.query().insert(
      samlAuthProviderPayload
    );

    return samlAuthProvider;
  }

  const samlAuthProvider = await SamlAuthProvider.query().patchAndFetchById(
    existingSamlAuthProvider.id,
    samlAuthProviderPayload
  );

  return samlAuthProvider;
};

export default upsertSamlAuthProvider;
