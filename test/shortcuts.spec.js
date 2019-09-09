import nock from 'nock';
import { expect } from '@lykmapipo/test-helpers';
import { disposeHttpClient, request } from '../src';

describe('client shortcuts', () => {
  beforeEach(() => {
    delete process.env.BASE_URL;
    delete process.env.REACT_APP_BASE_URL;
    disposeHttpClient();
    nock.cleanAll();
  });

  it('should send http request', done => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL)
      .get('/users')
      .query(true)
      .reply(200, data);

    request({ url: 'users' })
      .then(response => {
        expect(response).to.exist;
        expect(response.data).to.exist;
        done(null, data);
      })
      .catch(error => {
        done(error);
      });
  });

  afterEach(() => {
    delete process.env.BASE_URL;
    delete process.env.REACT_APP_BASE_URL;
    disposeHttpClient();
    nock.cleanAll();
  });
});
