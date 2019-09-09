import nock from 'nock';

describe('http client', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  after(() => {
    nock.cleanAll();
  });
});
