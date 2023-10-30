// @ts-nocheck
import request from 'supertest';
import app from '../../app';
import appConfig from '../../config/app';

describe('graphQL healthcheck query', () => {
  it('should return application version', async () => {
    const query = `
      query {
        healthcheck {
          version
        }
      }
    `;

    const response = await request(app)
      .post('/graphql')
      .send({ query })
      .expect(200);

    const expectedResponsePayload = {
      data: { healthcheck: { version: appConfig.version } },
    };

    expect(response.body).toEqual(expectedResponsePayload);
  });
});
