import { expect } from '@lykmapipo/test-helpers';
import { withDefaults } from '../src';

process.env.BASE_URL = 'https://127.0.0.1/v1/';

describe('http client', () => {
  it('should prepare default options', () => {
    expect(withDefaults).to.exist.and.be.a('function');

    const { baseUrl } = withDefaults();
    expect(baseUrl).to.exist.and.be.equal(process.env.BASE_URL);
  });

  it('should prepare given options', () => {
    expect(withDefaults).to.exist.and.be.a('function');

    const optns = { baseUrl: 'https://127.0.0.1/v2/' };
    const { baseUrl } = withDefaults(optns);
    expect(baseUrl).to.exist.and.be.equal(optns.baseUrl);
  });
});
