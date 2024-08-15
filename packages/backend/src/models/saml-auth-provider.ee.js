import { URL } from 'node:url';
import { v4 as uuidv4 } from 'uuid';
import appConfig from '../config/app.js';
import axios from '../helpers/axios-with-proxy.js';
import Base from './base.js';
import Identity from './identity.ee.js';
import SamlAuthProvidersRoleMapping from './saml-auth-providers-role-mapping.ee.js';

class SamlAuthProvider extends Base {
  static tableName = 'saml_auth_providers';

  static jsonSchema = {
    type: 'object',
    required: [
      'name',
      'certificate',
      'signatureAlgorithm',
      'entryPoint',
      'issuer',
      'firstnameAttributeName',
      'surnameAttributeName',
      'emailAttributeName',
      'roleAttributeName',
      'defaultRoleId',
    ],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      certificate: { type: 'string', minLength: 1 },
      signatureAlgorithm: {
        type: 'string',
        enum: ['sha1', 'sha256', 'sha512'],
      },
      issuer: { type: 'string', minLength: 1 },
      entryPoint: { type: 'string', minLength: 1 },
      firstnameAttributeName: { type: 'string', minLength: 1 },
      surnameAttributeName: { type: 'string', minLength: 1 },
      emailAttributeName: { type: 'string', minLength: 1 },
      roleAttributeName: { type: 'string', minLength: 1 },
      defaultRoleId: { type: 'string', format: 'uuid' },
      active: { type: 'boolean' },
    },
  };

  static relationMappings = () => ({
    identities: {
      relation: Base.HasOneRelation,
      modelClass: Identity,
      join: {
        from: 'identities.provider_id',
        to: 'saml_auth_providers.id',
      },
    },
    samlAuthProvidersRoleMappings: {
      relation: Base.HasManyRelation,
      modelClass: SamlAuthProvidersRoleMapping,
      join: {
        from: 'saml_auth_providers.id',
        to: 'saml_auth_providers_role_mappings.saml_auth_provider_id',
      },
    },
  });

  static get virtualAttributes() {
    return ['loginUrl', 'remoteLogoutUrl'];
  }

  get loginUrl() {
    return new URL(`/login/saml/${this.issuer}`, appConfig.baseUrl).toString();
  }

  get loginCallBackUrl() {
    return new URL(
      `/login/saml/${this.issuer}/callback`,
      appConfig.baseUrl
    ).toString();
  }

  get remoteLogoutUrl() {
    return this.entryPoint;
  }

  get config() {
    return {
      callbackUrl: this.loginCallBackUrl,
      cert: this.certificate,
      entryPoint: this.entryPoint,
      issuer: this.issuer,
      signatureAlgorithm: this.signatureAlgorithm,
      logoutUrl: this.remoteLogoutUrl
    };
  }

  generateLogoutRequestBody(sessionId) {
    const logoutRequest = `
      <samlp:LogoutRequest
          xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
          ID="${uuidv4()}"
          Version="2.0"
          IssueInstant="${new Date().toISOString()}"
          Destination="${this.remoteLogoutUrl}">

          <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${this.issuer}</saml:Issuer>
          <samlp:SessionIndex>${sessionId}</samlp:SessionIndex>
      </samlp:LogoutRequest>
    `;

    const encodedLogoutRequest = Buffer.from(logoutRequest).toString('base64')

    return encodedLogoutRequest
  }

  async terminateRemoteSession(sessionId) {
    const logoutRequest = this.generateLogoutRequestBody(sessionId);

    const response = await axios.post(
      this.remoteLogoutUrl,
      new URLSearchParams({
        SAMLRequest: logoutRequest,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    return response;
  }
}

export default SamlAuthProvider;
