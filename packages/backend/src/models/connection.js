import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';
import App from './app.js';
import AppConfig from './app-config.js';
import OAuthClient from './oauth-client.js';
import Base from './base.js';
import User from './user.js';
import Step from './step.js';
import appConfig from '../config/app.js';
import Telemetry from '../helpers/telemetry/index.js';
import globalVariable from '../helpers/global-variable.js';
import NotAuthorizedError from '../errors/not-authorized.js';

class Connection extends Base {
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
      oauthClientId: { type: 'string', format: 'uuid' },
      verified: { type: 'boolean', default: false },
      draft: { type: 'boolean' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
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
      filter(builder) {
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
    oauthClient: {
      relation: Base.BelongsToOneRelation,
      modelClass: OAuthClient,
      join: {
        from: 'connections.oauth_client_id',
        to: 'oauth_clients.id',
      },
    },
  });

  encryptData() {
    if (!this.eligibleForEncryption()) return;

    this.data = AES.encrypt(
      JSON.stringify(this.formattedData),
      appConfig.encryptionKey
    ).toString();

    delete this.formattedData;
  }

  decryptData() {
    if (!this.eligibleForDecryption()) return;

    this.formattedData = JSON.parse(
      AES.decrypt(this.data, appConfig.encryptionKey).toString(enc)
    );
  }

  eligibleForEncryption() {
    return this.formattedData ? true : false;
  }

  eligibleForDecryption() {
    return this.data ? true : false;
  }

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }

  async getAppConfig() {
    return await AppConfig.query().findOne({ key: this.key });
  }

  async checkEligibilityForCreation() {
    const app = await this.getApp();

    const appConfig = await this.getAppConfig();

    if (appConfig) {
      if (appConfig.disabled) {
        throw new NotAuthorizedError(
          'The application has been disabled for new connections!'
        );
      }

      if (appConfig.useOnlyPredefinedAuthClients && this.formattedData) {
        throw new NotAuthorizedError(
          `New custom connections have been disabled for ${app.name}!`
        );
      }

      if (!this.formattedData) {
        const authClient = await appConfig
          .$relatedQuery('oauthClients')
          .findById(this.oauthClientId)
          .where({ active: true })
          .throwIfNotFound();

        this.formattedData = authClient.formattedAuthDefaults;
      }
    }

    return this;
  }

  async testAndUpdateConnection() {
    const app = await this.getApp();
    const $ = await globalVariable({ connection: this, app });

    let isStillVerified;

    try {
      isStillVerified = !!(await app.auth.isStillVerified($));
    } catch {
      isStillVerified = false;
    }

    return await this.$query().patchAndFetch({
      formattedData: this.formattedData,
      verified: isStillVerified,
    });
  }

  async verifyAndUpdateConnection(request) {
    const app = await this.getApp();
    const $ = await globalVariable({ 
      connection: this, 
      app,
      request 
    });
    await app.auth.verifyCredentials($);

    return await this.$query().patchAndFetch({
      verified: true,
      draft: false,
    });
  }

  async verifyWebhook(request) {
    if (!this.key) return true;

    const app = await this.getApp();

    const $ = await globalVariable({
      connection: this,
      request,
    });

    if (!app.auth?.verifyWebhook) return true;

    return app.auth.verifyWebhook($);
  }

  async generateAuthUrl() {
    const app = await this.getApp();
    const $ = await globalVariable({ connection: this, app });

    await app.auth.generateAuthUrl($);

    const url = this.formattedData.url;

    return { url };
  }

  async reset() {
    const formattedData = this?.formattedData?.screenName
      ? { screenName: this.formattedData.screenName }
      : {};

    const updatedConnection = await this.$query().patchAndFetch({
      formattedData,
    });

    return updatedConnection;
  }

  async updateFormattedData({ formattedData, oauthClientId }) {
    if (oauthClientId) {
      const oauthClient = await OAuthClient.query()
        .findById(oauthClientId)
        .throwIfNotFound();

      formattedData = oauthClient.formattedAuthDefaults;
    }

    return await this.$query().patchAndFetch({
      formattedData: {
        ...this.formattedData,
        ...formattedData,
      },
    });
  }

  // TODO: Make another abstraction like beforeSave instead of using
  // beforeInsert and beforeUpdate separately for the same operation.
  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    await this.checkEligibilityForCreation();

    this.encryptData();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.encryptData();
  }

  async $afterFind() {
    this.decryptData();
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.connectionCreated(this);
  }

  async $afterUpdate(opt, queryContext) {
    await super.$afterUpdate(opt, queryContext);
    Telemetry.connectionUpdated(this);
  }
}

export default Connection;
