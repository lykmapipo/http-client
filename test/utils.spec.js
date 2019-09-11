import { expect, faker } from '@lykmapipo/test-helpers';
import { withDefaults, mapResponseToData } from '../src/utils';

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
});
