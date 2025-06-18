import SamlAuthProvider from '../../models/saml-auth-provider.ee';

const getSamlAuthProviders = async () => {
  const providers = await SamlAuthProvider.query();

  return providers;
};

export default getSamlAuthProviders;
