import SamlAuthProvider from '../../models/saml-auth-provider.ee';

const getSamlAuthProviders = async () => {
  const providers = await SamlAuthProvider.query().where({ active: true });

  return providers;
};

export default getSamlAuthProviders;
