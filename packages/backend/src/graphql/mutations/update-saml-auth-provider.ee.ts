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

const updateSamlAuthProvider = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'SamlAuthProvider');

  const samlAuthProviderPayload: Partial<SamlAuthProvider> = {
    ...params.input,
  };

  const existingSamlAuthProvider = await SamlAuthProvider.query()
    .limit(1)
    .first()
    .throwIfNotFound();

  const samlAuthProvider = await SamlAuthProvider.query().patchAndFetchById(
    existingSamlAuthProvider.id,
    samlAuthProviderPayload
  );

  return samlAuthProvider;
};

export default updateSamlAuthProvider;
