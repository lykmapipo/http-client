import { expect, faker } from '@lykmapipo/test-helpers';
import { withDefaults } from '../src/utils';

process.env.BASE_URL = 'https://127.0.0.1/v1/';

describe('http client', () => {
  it('should prepare default options', () => {
    expect(withDefaults).to.exist.and.be.a('function');

    const { baseUrl, headers } = withDefaults();
    expect(baseUrl).to.exist.and.be.equal(process.env.BASE_URL);
    expect(headers).to.exist.and.be.eql({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  });

  it('should prepare given options', () => {
    expect(withDefaults).to.exist.and.be.a('function');

    const optns = {
      baseUrl: 'https://127.0.0.1/v2/',
      headers: { 'X-API-Key': faker.random.uuid() },
    };
    const { baseUrl, headers } = withDefaults(optns);
    expect(baseUrl).to.exist.and.be.equal(optns.baseUrl);
    expect(headers).to.exist.and.be.eql({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': optns.headers['X-API-Key'],
    });
  });
});
