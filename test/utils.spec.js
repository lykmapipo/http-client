import { expect, faker } from '@lykmapipo/test-helpers';
import {
  withDefaults,
  mapResponseToData,
  mapResponseToError,
  wrapRequest,
} from '../src/utils';

describe('client utils', () => {
  it('should prepare default options', () => {
    expect(withDefaults).to.exist.and.be.a('function');

    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const { baseURL, headers } = withDefaults();
    expect(baseURL).to.exist.and.be.equal(process.env.BASE_URL);
    expect(headers).to.exist.and.be.eql({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  });

  it('should prepare given options', () => {
    expect(withDefaults).to.exist.and.be.a('function');

    const optns = {
      baseURL: 'https://127.0.0.1/v2/',
      headers: { 'X-API-Key': faker.random.uuid() },
    };
    const { baseURL, headers } = withDefaults(optns);
    expect(baseURL).to.exist.and.be.equal(optns.baseURL);
    expect(headers).to.exist.and.be.eql({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': optns.headers['X-API-Key'],
    });
  });

  it('should map response to data', () => {
    const response = { data: [] };
    const data = mapResponseToData(response);
    expect(data).to.exist.and.be.eql(response.data);
  });

  it('should map response to error on request setup', () => {
    let rawResponse = new Error('Request Failed');
    let error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(400);
    expect(error.code).to.be.equal(400);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal('Bad Request');

    rawResponse = { message: 'Request Failed' };
    error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(400);
    expect(error.code).to.be.equal(400);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal('Bad Request');

    rawResponse = { description: 'Request Failed' };
    error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(400);
    expect(error.code).to.be.equal(400);
    expect(error.message).to.be.equal(rawResponse.description);
    expect(error.description).to.be.equal(rawResponse.description);

    rawResponse = { message: 'Request Failed', description: 'Bad Request' };
    error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(400);
    expect(error.code).to.be.equal(400);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal(rawResponse.description);
  });

  it('should map response to error on server no response', () => {
    let rawResponse = { message: 'Request Failed', request: {} };
    let error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(503);
    expect(error.code).to.be.equal(503);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal('Service Unavailable');

    rawResponse = {
      description: 'Service Unavailable',
      request: {},
    };
    error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(503);
    expect(error.code).to.be.equal(503);
    expect(error.message).to.be.equal(rawResponse.description);
    expect(error.description).to.be.equal(rawResponse.description);

    rawResponse = {
      message: 'Request Failed',
      description: 'Service Unavailable',
      request: {},
    };
    error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(503);
    expect(error.code).to.be.equal(503);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal(rawResponse.description);
  });

  it('should map response to error on server response', () => {
    let rawResponse = {
      message: 'Cast Error',
      response: { code: 400, status: 400 },
    };
    let error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(rawResponse.response.code);
    expect(error.code).to.be.equal(rawResponse.response.status);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal(rawResponse.message);

    rawResponse = {
      code: 400,
      status: 400,
      message: 'Cast Error',
      response: {},
    };
    error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(rawResponse.code);
    expect(error.code).to.be.equal(rawResponse.status);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal(rawResponse.message);
  });

  it('should wrap request and yield data', done => {
    const rawResponse = { status: 200, data: [] };
    const request = Promise.resolve(rawResponse);

    wrapRequest(request)
      .then(data => {
        expect(data).to.exist.and.be.eql(rawResponse.data);
        done(null, data);
      })
      .catch(done);
  });

  it('should wrap request and yield error', done => {
    const rawResponse = { status: 400, message: 'Bad Request' };
    const request = Promise.reject(rawResponse);

    wrapRequest(request).catch(error => {
      expect(error).to.exist.and.be.an.instanceof(Error);
      expect(error.status).to.be.equal(rawResponse.status);
      expect(error.message).to.be.equal(rawResponse.message);
      expect(error.description).to.be.equal(rawResponse.message);
      done();
    });
  });
});
