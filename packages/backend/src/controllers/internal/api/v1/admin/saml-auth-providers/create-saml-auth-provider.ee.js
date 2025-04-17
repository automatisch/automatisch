import { renderObject } from '../../../../../../helpers/renderer.js';
import SamlAuthProvider from '../../../../../../models/saml-auth-provider.ee.js';

export default async (request, response) => {
  const samlAuthProvider = await SamlAuthProvider.query().insert(
    samlAuthProviderParams(request)
  );

  renderObject(response, samlAuthProvider, {
    serializer: 'AdminSamlAuthProvider',
    status: 201,
  });
};

const samlAuthProviderParams = (request) => {
  const {
    name,
    certificate,
    signatureAlgorithm,
    issuer,
    entryPoint,
    firstnameAttributeName,
    surnameAttributeName,
    emailAttributeName,
    roleAttributeName,
    defaultRoleId,
    active,
  } = request.body;

  return {
    name,
    certificate,
    signatureAlgorithm,
    issuer,
    entryPoint,
    firstnameAttributeName,
    surnameAttributeName,
    emailAttributeName,
    roleAttributeName,
    defaultRoleId,
    active,
  };
};
