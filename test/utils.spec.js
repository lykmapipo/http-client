import { readFileSync } from 'fs';
import { expect, faker } from '@lykmapipo/test-helpers';
import FormData from 'form-data';
import {
  withDefaults,
  createAgents,
  isFormData,
  toFormData,
  normalizeRequest,
  mapResponseToData,
  mapResponseToError,
  wrapRequest,
} from '../src/utils';

const CA_FILE_PATH = `${__dirname}/fixtures/ssl/root.pem`;
const CERT_FILE_PATH = `${__dirname}/fixtures/ssl/test.crt`;
const KEY_FILE_PATH = `${__dirname}/fixtures/ssl/test.key`;

describe('client utils', () => {
  it('should check form data value', () => {
    expect(isFormData('a')).to.be.false;
    expect(isFormData(1)).to.be.false;
    expect(isFormData({})).to.be.false;
    expect(isFormData(new FormData())).to.be.true;
  });

  it('should not create http agents when no options', () => {
    const agents = createAgents();
    expect(agents).to.exist;
    expect(agents.httpAgent).to.not.exist;
    expect(agents.httpsAgent).to.not.exist;
  });

  it('should create http agents with options', () => {
    const options = {
      agentOptions: {
        ca: readFileSync(CA_FILE_PATH),
        cert: readFileSync(CERT_FILE_PATH),
        key: readFileSync(KEY_FILE_PATH),
        passphrase: 'password',
      },
    };
    const agents = createAgents(options);
    expect(agents).to.exist;
    expect(agents.httpAgent).to.exist;
    expect(agents.httpsAgent).to.exist;
  });

  it('should create form data', () => {
    expect(isFormData(toFormData())).to.be.true;
    expect(isFormData(toFormData({}))).to.be.true;
    expect(isFormData(toFormData({ key: undefined }))).to.be.true;

    const value = { name: faker.name.findName() };
    const data = toFormData(value);
    expect(isFormData(data)).to.be.true;
  });

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

  it('should normalize json request', () => {
    const data = { name: faker.name.findName() };
    const request = normalizeRequest({ data });
    expect(request).to.exist;
    expect(request.data).to.exist.and.be.eql(data);
  });

  it('should normalize form data request', () => {
    const data = { name: faker.name.findName() };
    const request = normalizeRequest({ data: toFormData(data) });
    expect(request).to.exist;
    expect(request.data).to.exist.and.be.an.instanceof(FormData);
    expect(request.headers).to.exist;
    expect(request.headers['content-type']).to.contain(
      'multipart/form-data; boundary'
    );
  });

  it('should normalize form data request', () => {
    const data = { name: faker.name.findName() };
    const request = normalizeRequest({
      data: toFormData(data),
      multipart: true,
    });
    expect(request).to.exist;
    expect(request.data).to.exist.and.be.an.instanceof(FormData);
    expect(request.headers).to.exist;
    expect(request.headers['content-type']).to.contain(
      'multipart/form-data; boundary'
    );
  });

  it('should normalize json data to form data request via options', () => {
    const data = { name: faker.name.findName() };
    const request = normalizeRequest({ data, multipart: true });
    expect(request).to.exist;
    expect(request.data).to.exist.and.be.an.instanceof(FormData);
    expect(request.headers).to.exist;
    expect(request.headers['content-type']).to.contain(
      'multipart/form-data; boundary'
    );
  });

  it('should normalize json data to form data request via headers', () => {
    const data = { name: faker.name.findName() };
    const headers = { 'Content-Type': 'multipart/form-data' };
    const request = normalizeRequest({ data, headers });
    expect(request).to.exist;
    expect(request.data).to.exist.and.be.an.instanceof(FormData);
    expect(request.headers).to.exist;
    expect(request.headers['content-type']).to.contain(
      'multipart/form-data; boundary'
    );
  });

  it('should normalize json data to form data request via headers', () => {
    const data = { name: faker.name.findName() };
    const headers = { 'content-type': 'multipart/form-data' };
    const request = normalizeRequest({ data, headers });
    expect(request).to.exist;
    expect(request.data).to.exist.and.be.an.instanceof(FormData);
    expect(request.headers).to.exist;
    expect(request.headers['content-type']).to.contain(
      'multipart/form-data; boundary'
    );
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

  it('should wrap request and yield data', (done) => {
    const rawResponse = { status: 200, data: [] };
    const request = Promise.resolve(rawResponse);

    wrapRequest(request)
      .then((data) => {
        expect(data).to.exist.and.be.eql(rawResponse.data);
        done(null, data);
      })
      .catch(done);
  });

  it('should wrap request and yield raw response', (done) => {
    const rawResponse = { status: 200, data: [] };
    const request = Promise.resolve(rawResponse);

    wrapRequest(request, true)
      .then((data) => {
        expect(data).to.exist.and.be.eql(rawResponse);
        done(null, data);
      })
      .catch(done);
  });

  it('should wrap request and yield error', (done) => {
    const rawResponse = { status: 400, message: 'Bad Request' };
    const request = Promise.reject(rawResponse);

    wrapRequest(request).catch((error) => {
      expect(error).to.exist.and.be.an.instanceof(Error);
      expect(error.status).to.be.equal(rawResponse.status);
      expect(error.message).to.be.equal(rawResponse.message);
      expect(error.description).to.be.equal(rawResponse.message);
      done();
    });
  });
});
