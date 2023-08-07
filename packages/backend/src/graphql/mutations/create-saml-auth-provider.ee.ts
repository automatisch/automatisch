import type { SamlConfig } from '@node-saml/passport-saml';
import SamlAuthProvider from '../../models/saml-auth-provider.ee';
import Context from '../../types/express/context';

type Params = {
  input: {
    name: string;
    certificate: string;
    signatureAlgorithm: SamlConfig['signatureAlgorithm'];
    issuer: string;
    entryPoint: string;
    firstnameAttributeName: string;
    surnameAttributeName: string;
    emailAttributeName: string;
    roleAttributeName: string;
    defaultRoleId: string;
    active: boolean;
  };
};

const createSamlAuthProvider = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('create', 'SamlAuthProvider');

  const samlAuthProviderPayload: Partial<SamlAuthProvider> = {
    ...params.input,
  };

  const existingSamlAuthProvider = await SamlAuthProvider.query()
    .limit(1)
    .first();

  let samlAuthProvider: SamlAuthProvider;

  if (!existingSamlAuthProvider) {
    samlAuthProvider = await SamlAuthProvider.query().insert(
      samlAuthProviderPayload
    );

    return samlAuthProvider;
  }

  samlAuthProvider = await SamlAuthProvider.query().patchAndFetchById(
    existingSamlAuthProvider.id,
    samlAuthProviderPayload
  );

  return samlAuthProvider;
};

export default createSamlAuthProvider;
