import { expect, faker } from '@lykmapipo/test-helpers';
import {
  withDefaults,
  mapResponseToData,
  mapResponseToError,
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
  });

  it('should map response to error on server no response', () => {
    const rawResponse = { message: 'Request Failed', request: {} };
    const error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(503);
    expect(error.code).to.be.equal(503);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal('Service Unavailable');
  });

  it('should map response to error on server response', () => {
    const rawResponse = {
      message: 'Cast Error',
      response: { code: 400, status: 400 },
    };
    const error = mapResponseToError(rawResponse);
    expect(error).to.exist.and.be.an.instanceof(Error);
    expect(error.status).to.be.equal(rawResponse.response.code);
    expect(error.code).to.be.equal(rawResponse.response.status);
    expect(error.message).to.be.equal(rawResponse.message);
    expect(error.description).to.be.equal(rawResponse.message);
  });
});
