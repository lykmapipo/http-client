import { expect, faker, nock } from '@lykmapipo/test-helpers';
import { CONTENT_TYPE } from '../src/utils';
import { createHttpClient, disposeHttpClient } from '../src';

describe('http client', () => {
  beforeEach(() => {
    delete process.env.BASE_URL;
    delete process.env.REACT_APP_BASE_URL;
    disposeHttpClient();
    nock.cleanAll();
  });

  it('should expose client create factory', () => {
    expect(createHttpClient).to.exist;
    expect(createHttpClient).to.exist.and.to.be.a('function');
    expect(createHttpClient.name).to.be.equal('createHttpClient');
    expect(createHttpClient.length).to.be.equal(1);
  });

  it('should create http client using `env.BASE_URL`', () => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const client = createHttpClient();
    expect(client).to.exist;
    expect(client.defaults.headers.Accept).to.be.equal(CONTENT_TYPE);
    expect(client.defaults.headers['Content-Type']).to.be.equal(CONTENT_TYPE);
    // expect(client.defaults.baseURL).to.be.equal(process.env.BASE_URL);
  });

  it('should create http client using `env.REACT_APP_BASE_URL`', () => {
    process.env.REACT_APP_BASE_URL = 'https://127.0.0.1/v2/';
    const client = createHttpClient();
    expect(client).to.exist;
    expect(client.defaults.headers.Accept).to.be.equal(CONTENT_TYPE);
    expect(client.defaults.headers['Content-Type']).to.be.equal(CONTENT_TYPE);
    // expect(client.defaults.baseURL).to.be.equal(process.env.REACT_APP_BASE_URL);
  });

  it('should create http client using given options', () => {
    const optns = {
      baseURL: 'https://127.0.0.1/v3/',
      headers: { 'X-API-Key': faker.random.uuid() },
    };
    const client = createHttpClient(optns);
    expect(client).to.exist;
    expect(client.defaults.headers.Accept).to.be.equal(CONTENT_TYPE);
    expect(client.defaults.headers['Content-Type']).to.be.equal(CONTENT_TYPE);
    expect(client.defaults.headers['X-API-Key']).to.be.equal(
      optns.headers['X-API-Key']
    );
    // expect(client.defaults.baseURL).to.be.equal(optns.baseURL);
  });

  it('should not re-create http client', () => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const first = createHttpClient();
    const second = createHttpClient();
    expect(first).to.exist;
    expect(second).to.exist;
    expect(first.id === second.id).to.be.true;
  });

  it('should dispose http client', () => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const created = createHttpClient();
    expect(created).to.exist;
    const disposed = disposeHttpClient();
    expect(disposed).to.not.exist;
  });

  afterEach(() => {
    delete process.env.BASE_URL;
    delete process.env.REACT_APP_BASE_URL;
    disposeHttpClient();
    nock.cleanAll();
  });
});
