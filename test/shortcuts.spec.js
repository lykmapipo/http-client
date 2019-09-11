import nock from 'nock';
import { expect } from '@lykmapipo/test-helpers';
import { disposeHttpClient, request, del, get, head, options } from '../src';

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

    request({ url: '/users' })
      .then(response => {
        expect(response).to.exist;
        expect(response.data).to.exist;
        done(null, data);
      })
      .catch(error => {
        done(error);
      });
  });

  it('should send http delete request', done => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = {};
    nock(process.env.BASE_URL)
      .delete('/users/5c1766243c9d520004e2b542')
      .query(true)
      .reply(200, data);

    del('/users/5c1766243c9d520004e2b542')
      .then(response => {
        expect(response).to.exist;
        expect(response).to.exist;
        expect(response).to.be.eql(data);
        done(null, data);
      })
      .catch(error => {
        done(error);
      });
  });

  it('should send http get request', done => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL)
      .get('/users')
      .query(true)
      .reply(200, data);

    get('/users')
      .then(users => {
        expect(users).to.exist;
        expect(users).to.be.eql(data);
        done(null, data);
      })
      .catch(error => {
        done(error);
      });
  });

  it('should send http head request', done => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    nock(process.env.BASE_URL)
      .defaultReplyHeaders({
        'Content-Type': 'application/json',
      })
      .head('/users/5c1766243c9d520004e2b542')
      .query(true)
      .reply(200);

    head('/users/5c1766243c9d520004e2b542')
      .then(response => {
        expect(response).to.exist;
        expect(response).to.exist;
        expect(response.headers).to.exist;
        done(null, response);
      })
      .catch(error => {
        done(error);
      });
  });

  it('should send http options request', done => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    nock(process.env.BASE_URL)
      .defaultReplyHeaders({
        'Content-Type': 'application/json',
      })
      .options('/users/5c1766243c9d520004e2b542')
      .query(true)
      .reply(200);

    options('/users/5c1766243c9d520004e2b542')
      .then(response => {
        expect(response).to.exist;
        expect(response).to.exist;
        expect(response.headers).to.exist;
        done(null, response);
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
