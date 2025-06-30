import { URL } from 'node:url';
import type { SamlConfig } from '@node-saml/passport-saml';
import appConfig from '../config/app';
import Base from './base';
import Identity from './identity.ee';

class SamlAuthProvider extends Base {
  id!: string;
  name: string;
  certificate: string;
  signatureAlgorithm: SamlConfig["signatureAlgorithm"];
  issuer: string;
  entryPoint: string;
  firstnameAttributeName: string;
  surnameAttributeName: string;
  emailAttributeName: string;
  roleAttributeName: string;
  defaultRoleId: string;

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
      signatureAlgorithm: { type: 'string', enum: ['sha1', 'sha256', 'sha512'] },
      issuer: { type: 'string', minLength: 1 },
      entryPoint: { type: 'string', minLength: 1 },
      firstnameAttributeName: { type: 'string', minLength: 1 },
      surnameAttributeName: { type: 'string', minLength: 1 },
      emailAttributeName: { type: 'string', minLength: 1 },
      roleAttributeName: { type: 'string', minLength: 1 },
      defaultRoleId: { type: 'string', format: 'uuid' }
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
  });

  get config(): SamlConfig {
    const callbackUrl = new URL(
      `/login/saml/${this.issuer}/callback`,
      appConfig.baseUrl
    ).toString();

    return {
      callbackUrl,
      cert: this.certificate,
      entryPoint: this.entryPoint,
      issuer: this.issuer,
      signatureAlgorithm: this.signatureAlgorithm,
    }
  }
}

export default SamlAuthProvider;
