import { createRole } from './role';
import SamlAuthProvider from '../../src/models/saml-auth-provider.ee.js';

export const createSamlAuthProvider = async (params = {}) => {
  params.name = params?.name || 'Keycloak SAML';
  params.certificate = params?.certificate || 'certificate';
  params.signatureAlgorithm = params?.signatureAlgorithm || 'sha512';

  params.entryPoint =
    params?.entryPoint ||
    'https://example.com/auth/realms/automatisch/protocol/saml';

  params.issuer = params?.issuer || 'automatisch-client';

  params.firstnameAttributeName =
    params?.firstnameAttributeName || 'urn:oid:2.1.1.42';

  params.surnameAttributeName =
    params?.surnameAttributeName || 'urn:oid:2.1.1.4';

  params.emailAttributeName =
    params?.emailAttributeName || 'urn:oid:1.1.2342.19200300.100.1.1';

  params.roleAttributeName = params?.roleAttributeName || 'Role';
  params.defaultRoleId = params?.defaultRoleId || (await createRole()).id;
  params.active = params?.active || true;

  const samlAuthProvider = await SamlAuthProvider.query().insertAndFetch(
    params
  );

  return samlAuthProvider;
};
