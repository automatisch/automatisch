import { IJSONObject, IRequest } from '@automatisch/types';
import { AES, enc } from 'crypto-js';
import type { RelationMappings } from 'objection';
import { ModelOptions, QueryContext } from 'objection';
import appConfig from '../config/app';
import globalVariable from '../helpers/global-variable';
import Telemetry from '../helpers/telemetry';
import App from './app';
import AppAuthClient from './app-auth-client';
import AppConfig from './app-config';
import Base from './base';
import ExtendedQueryBuilder from './query-builder';
import SharedConnection from './shared-connection';
import Step from './step';
import User from './user';

class Connection extends Base {
  id!: string;
  key!: string;
  data: string;
  formattedData?: IJSONObject;
  userId!: string;
  verified: boolean;
  draft: boolean;
  count?: number;
  flowCount?: number;
  sharedConnections?: SharedConnection[];
  // computed via `User.relevantConnectionsQuery`
  shared?: boolean;
  user?: User;
  steps?: Step[];
  triggerSteps?: Step[];
  appAuthClientId?: string;
  appAuthClient?: AppAuthClient;
  appConfig?: AppConfig;

  static tableName = 'connections';

  static jsonSchema = {
    type: 'object',
    required: ['key'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      key: { type: 'string', minLength: 1, maxLength: 255 },
      data: { type: 'string' },
      formattedData: { type: 'object' },
      userId: { type: 'string', format: 'uuid' },
      appAuthClientId: { type: 'string', format: 'uuid' },
      verified: { type: 'boolean', default: false },
      draft: { type: 'boolean' },
      shared: { type: 'boolean', readOnly: true, },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static get virtualAttributes() {
    return ['reconnectable'];
  }

  static relationMappings = (): RelationMappings => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'connections.user_id',
        to: 'users.id',
      },
    },
    steps: {
      relation: Base.HasManyRelation,
      modelClass: Step,
      join: {
        from: 'connections.id',
        to: 'steps.connection_id',
      },
    },
    triggerSteps: {
      relation: Base.HasManyRelation,
      modelClass: Step,
      join: {
        from: 'connections.id',
        to: 'steps.connection_id',
      },
      filter(builder: ExtendedQueryBuilder<Step>) {
        builder.where('type', '=', 'trigger');
      },
    },
    appConfig: {
      relation: Base.BelongsToOneRelation,
      modelClass: AppConfig,
      join: {
        from: 'connections.key',
        to: 'app_configs.key',
      },
    },
    appAuthClient: {
      relation: Base.BelongsToOneRelation,
      modelClass: AppAuthClient,
      join: {
        from: 'connections.app_auth_client_id',
        to: 'app_auth_clients.id',
      },
    },
    sharedConnections: {
      relation: Base.HasManyRelation,
      modelClass: SharedConnection,
      join: {
        from: 'connections.id',
        to: 'shared_connections.connection_id',
      },
    },
  });

  get reconnectable() {
    if (this.appAuthClientId) {
      return this.appAuthClient.active;
    }

    if (this.appConfig) {
      return !this.appConfig.disabled && this.appConfig.allowCustomConnection;
    }

    return true;
  }

  encryptData(): void {
    if (!this.eligibleForEncryption()) return;

    this.data = AES.encrypt(
      JSON.stringify(this.formattedData),
      appConfig.encryptionKey
    ).toString();

    delete this.formattedData;
  }

  decryptData(): void {
    if (!this.eligibleForDecryption()) return;

    this.formattedData = JSON.parse(
      AES.decrypt(this.data, appConfig.encryptionKey).toString(enc.Utf8)
    );
  }

  eligibleForEncryption(): boolean {
    return this.formattedData ? true : false;
  }

  eligibleForDecryption(): boolean {
    return this.data ? true : false;
  }

  // TODO: Make another abstraction like beforeSave instead of using
  // beforeInsert and beforeUpdate separately for the same operation.
  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    await super.$beforeInsert(queryContext);
    this.encryptData();
  }

  async $beforeUpdate(
    opt: ModelOptions,
    queryContext: QueryContext
  ): Promise<void> {
    await super.$beforeUpdate(opt, queryContext);
    this.encryptData();
  }

  async $afterFind(): Promise<void> {
    this.decryptData();
  }

  async $afterInsert(queryContext: QueryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.connectionCreated(this);
  }

  async $afterUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$afterUpdate(opt, queryContext);
    Telemetry.connectionUpdated(this);
  }

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }

  async verifyWebhook(request: IRequest) {
    if (!this.key) return true;

    const app = await this.getApp();

    const $ = await globalVariable({
      connection: this,
      request,
    });

    if (!app.auth?.verifyWebhook) return true;

    return app.auth.verifyWebhook($);
  }
}

export default Connection;
