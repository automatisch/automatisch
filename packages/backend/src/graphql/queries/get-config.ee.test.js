import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { createConfig } from '../../../test/factories/config';
import appConfig from '../../config/app';
import * as license from '../../helpers/license.ee';

describe('graphQL getConfig query', () => {
  let configOne, configTwo, configThree, query;

  beforeEach(async () => {
    configOne = await createConfig({ key: 'configOne' });
    configTwo = await createConfig({ key: 'configTwo' });
    configThree = await createConfig({ key: 'configThree' });

    query = `
      query {
        getConfig
      }
    `;
  });

  describe('and without valid license', () => {
    beforeEach(async () => {
      vi.spyOn(license, 'hasValidLicense').mockResolvedValue(false);
    });

    describe('and correct permissions', () => {
      it('should return empty config data', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const expectedResponsePayload = { data: { getConfig: {} } };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });
  });

  describe('and with valid license', () => {
    beforeEach(async () => {
      vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
    });

    describe('and without providing specific keys', () => {
      it('should return all config data', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const expectedResponsePayload = {
          data: {
            getConfig: {
              [configOne.key]: configOne.value.data,
              [configTwo.key]: configTwo.value.data,
              [configThree.key]: configThree.value.data,
              disableNotificationsPage: false,
              disableFavicon: false,
              additionalDrawerLink: undefined,
              additionalDrawerLinkText: undefined,
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });

    describe('and with providing specific keys', () => {
      it('should return all config data', async () => {
        query = `
          query {
            getConfig(keys: ["configOne", "configTwo"])
          }
        `;

        const response = await request(app)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const expectedResponsePayload = {
          data: {
            getConfig: {
              [configOne.key]: configOne.value.data,
              [configTwo.key]: configTwo.value.data,
              disableNotificationsPage: false,
              disableFavicon: false,
              additionalDrawerLink: undefined,
              additionalDrawerLinkText: undefined,
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });

    describe('and with different defaults', () => {
      beforeEach(async () => {
        vi.spyOn(appConfig, 'disableNotificationsPage', 'get').mockReturnValue(
          true
        );
        vi.spyOn(appConfig, 'disableFavicon', 'get').mockReturnValue(true);
        vi.spyOn(appConfig, 'additionalDrawerLink', 'get').mockReturnValue(
          'https://automatisch.io'
        );
        vi.spyOn(appConfig, 'additionalDrawerLinkText', 'get').mockReturnValue(
          'Automatisch'
        );
      });

      it('should return custom config', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const expectedResponsePayload = {
          data: {
            getConfig: {
              [configOne.key]: configOne.value.data,
              [configTwo.key]: configTwo.value.data,
              [configThree.key]: configThree.value.data,
              disableNotificationsPage: true,
              disableFavicon: true,
              additionalDrawerLink: 'https://automatisch.io',
              additionalDrawerLinkText: 'Automatisch',
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });
  });
});
