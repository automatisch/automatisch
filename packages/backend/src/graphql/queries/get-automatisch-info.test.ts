import { setMockConfig } from '../../../test/setup/set-mock-config';
import request from 'supertest';
import app from '../../app';
import * as license from '../../helpers/license.ee';

describe('graphQL getAutomatischInfo query', () => {
  const query = `
    query {
      getAutomatischInfo {
        isCloud
        license {
          id
          name
          expireAt
          verified
        }
      }
    }
  `;

  describe('and without valid license', () => {
    beforeEach(async () => {
      jest.spyOn(license, 'getLicense').mockResolvedValue(false);
    });

    it('should return empty license data', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const expectedResponsePayload = {
        data: {
          getAutomatischInfo: {
            isCloud: false,
            license: {
              id: null as string,
              name: null as string,
              expireAt: null as string,
              verified: false,
            },
          },
        },
      };

      expect(response.body).toEqual(expectedResponsePayload);
    });
  });

  describe('and with valid license', () => {
    beforeEach(async () => {
      const mockedLicense = {
        id: '123123',
        name: 'Test License',
        expireAt: '2025-08-09T10:56:54.144Z',
        verified: true,
      };

      jest.spyOn(license, 'getLicense').mockResolvedValue(mockedLicense);
    });

    describe('and with cloud flag enabled', () => {
      beforeEach(async () => {
        setMockConfig({ isCloud: true });
      });

      it('should return all license data', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const expectedResponsePayload = {
          data: {
            getAutomatischInfo: {
              isCloud: true,
              license: {
                expireAt: '2025-08-09T10:56:54.144Z',
                id: '123123',
                name: 'Test License',
                verified: true,
              },
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });

    describe('and with cloud flag disabled', () => {
      beforeEach(async () => {
        setMockConfig({ isCloud: false });
      });

      it('should return all license data', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const expectedResponsePayload = {
          data: {
            getAutomatischInfo: {
              isCloud: false,
              license: {
                expireAt: '2025-08-09T10:56:54.144Z',
                id: '123123',
                name: 'Test License',
                verified: true,
              },
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });
  });
});
