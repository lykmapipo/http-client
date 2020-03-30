import { createReadStream, readFileSync } from 'fs';
import http from 'http';
import https from 'https';
import { expect, nock } from '@lykmapipo/test-helpers';
import {
  disposeHttpClient,
  toFormData,
  request,
  all,
  spread,
  del,
  get,
  head,
  options,
  patch,
  post,
  put,
  sendFile,
  fetchFile,
} from '../src';

const CA_FILE_PATH = `${__dirname}/fixtures/ssl/root.pem`;
const CERT_FILE_PATH = `${__dirname}/fixtures/ssl/test.crt`;
const KEY_FILE_PATH = `${__dirname}/fixtures/ssl/test.key`;

describe('client shortcuts', () => {
  beforeEach(() => {
    delete process.env.BASE_URL;
    delete process.env.REACT_APP_BASE_URL;
    disposeHttpClient();
    nock.cleanAll();
  });

  it('should send http request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL).get('/users').query(true).reply(200, data);

    request({ url: '/users' })
      .then((response) => {
        expect(response).to.exist;
        expect(response.data).to.exist;
        done(null, data);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send http request with agent', (done) => {
    process.env.BASE_URL = 'http://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL)
      .get('/users')
      .query(true)
      .reply(200, function onReply() {
        expect(this.req.options.agent).to.be.an.instanceof(http.Agent);
        return data;
      });

    const optns = {
      url: '/users',
      agentOptions: {
        ca: readFileSync(CA_FILE_PATH),
        cert: readFileSync(CERT_FILE_PATH),
        key: readFileSync(KEY_FILE_PATH),
        passphrase: 'password',
      },
    };

    request(optns)
      .then((response) => {
        expect(response).to.exist;
        expect(response.data).to.exist;
        done(null, data);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send https request with agent', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL)
      .get('/users')
      .query(true)
      .reply(200, function onReply() {
        expect(this.req.options.agent).to.be.an.instanceof(https.Agent);
        return data;
      });

    const optns = {
      url: '/users',
      agentOptions: {
        ca: readFileSync(CA_FILE_PATH),
        cert: readFileSync(CERT_FILE_PATH),
        key: readFileSync(KEY_FILE_PATH),
        passphrase: 'password',
      },
    };

    request(optns)
      .then((response) => {
        expect(response).to.exist;
        expect(response.data).to.exist;
        done(null, data);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should issue requests in parallel', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL).get('/roles').query(true).reply(200, data);
    nock(process.env.BASE_URL).get('/users').query(true).reply(200, data);

    all(request({ url: '/roles' }), request({ url: '/users' }))
      .then(
        spread((roles, users) => {
          expect(roles).to.exist;
          expect(roles.data).to.exist;
          expect(users).to.exist;
          expect(users.data).to.exist;
          done(null, data);
        })
      )
      .catch((error) => {
        done(error);
      });
  });

  it('should send http delete request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = {};
    nock(process.env.BASE_URL)
      .delete('/users/5c1766243')
      .query(true)
      .reply(200, data);

    del('/users/5c1766243')
      .then((response) => {
        expect(response).to.exist;
        expect(response).to.exist;
        expect(response).to.be.eql(data);
        done(null, data);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send http get request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL).get('/users').query(true).reply(200, data);

    get('/users')
      .then((users) => {
        expect(users).to.exist;
        expect(users).to.be.eql(data);
        done(null, data);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should issue get requests in parallel', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { data: [] };
    nock(process.env.BASE_URL).get('/roles').query(true).reply(200, data);
    nock(process.env.BASE_URL).get('/users').query(true).reply(200, data);

    all(get('/roles'), get('/users'))
      .then(
        spread((roles, users) => {
          expect(roles).to.exist;
          expect(users).to.exist;
          done(null, data);
        })
      )
      .catch((error) => {
        done(error);
      });
  });

  it('should send http head request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    nock(process.env.BASE_URL)
      .defaultReplyHeaders({
        'Content-Type': 'application/json',
      })
      .head('/users/5c1766243')
      .query(true)
      .reply(200);

    head('/users/5c1766243')
      .then((response) => {
        expect(response).to.exist;
        expect(response).to.exist;
        expect(response.headers).to.exist;
        done(null, response);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send http options request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    nock(process.env.BASE_URL)
      .defaultReplyHeaders({
        'Content-Type': 'application/json',
      })
      .options('/users/5c1766243')
      .query(true)
      .reply(200);

    options('/users/5c1766243')
      .then((response) => {
        expect(response).to.exist;
        expect(response).to.exist;
        expect(response.headers).to.exist;
        done(null, response);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send http patch request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL)
      .patch('/users/5c1766243')
      .query(true)
      .reply(200, data);

    patch('/users/5c1766243', data)
      .then((user) => {
        expect(user).to.exist;
        expect(user).to.exist;
        expect(user).to.be.eql(data);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should reject send http patch request if no payload', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL)
      .patch('/users/5c1766243')
      .query(true)
      .reply(200, data);

    patch('/users/5c1766243', {}).catch((error) => {
      expect(error).to.exist;
      expect(error.message).to.be.equal('Missing Payload');
      done();
    });
  });

  it('should send http post request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL).post('/users').query(true).reply(201, data);

    post('/users', data)
      .then((user) => {
        expect(user).to.exist;
        expect(user).to.exist;
        expect(user).to.be.eql(data);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should reject send http post request if no payload', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL).post('/users').query(true).reply(201, data);

    post('/users', {}).catch((error) => {
      expect(error).to.exist;
      expect(error.message).to.be.equal('Missing Payload');
      done();
    });
  });

  it('should send http put request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL)
      .put('/users/5c1766243')
      .query(true)
      .reply(200, data);

    put('/users/5c1766243', data)
      .then((user) => {
        expect(user).to.exist;
        expect(user).to.exist;
        expect(user).to.be.eql(data);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should reject send http put request if no payload', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL)
      .put('/users/5c1766243')
      .query(true)
      .reply(200, data);

    put('/users/5c1766243', {}).catch((error) => {
      expect(error).to.exist;
      expect(error.message).to.be.equal('Missing Payload');
      done();
    });
  });

  // multipart
  it('should send http post multipart request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL)
      .post('/users')
      .query(true)
      .reply(201, function onReply() {
        expect(this.req.headers).to.exist;
        expect(this.req.headers['content-type']).to.contain(
          'multipart/form-data; boundary'
        );
        return data;
      });

    post('/users', toFormData(data))
      .then((user) => {
        expect(user).to.exist;
        expect(user).to.exist;
        expect(user).to.be.eql(data);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send http put multipart request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    nock(process.env.BASE_URL)
      .put('/users')
      .query(true)
      .reply(201, function onReply() {
        expect(this.req.headers).to.exist;
        expect(this.req.headers['content-type']).to.contain(
          'multipart/form-data; boundary'
        );
        return data;
      });

    put('/users', data, { multipart: true })
      .then((user) => {
        expect(user).to.exist;
        expect(user).to.exist;
        expect(user).to.be.eql(data);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send http patch multipart request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { age: 11 };
    const headers = { 'Content-Type': 'multipart/form-data' };
    nock(process.env.BASE_URL)
      .patch('/users')
      .query(true)
      .reply(201, function onReply() {
        expect(this.req.headers).to.exist;
        expect(this.req.headers['content-type']).to.contain(
          'multipart/form-data; boundary'
        );
        return data;
      });

    patch('/users', data, { headers })
      .then((user) => {
        expect(user).to.exist;
        expect(user).to.exist;
        expect(user).to.be.eql(data);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  });

  // file
  it.skip('should send file stream via http post multipart request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { name: 'image.png' };
    nock(process.env.BASE_URL)
      .post('/files')
      .reply(201, function onReply() {
        expect(this.req.headers).to.exist;
        expect(this.req.headers['content-type']).to.contain(
          'multipart/form-data; boundary'
        );
        return data;
      });

    const image = createReadStream(`${__dirname}/fixtures/image.png`);
    sendFile('/files', { image })
      .then((file) => {
        expect(file).to.exist;
        expect(file).to.exist;
        expect(file).to.be.eql(data);
        done(null, file);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should send file buffer via http post multipart request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    const data = { name: 'image.png' };
    nock(process.env.BASE_URL)
      .post('/files')
      .query(true)
      .reply(201, function onReply() {
        expect(this.req.headers).to.exist;
        expect(this.req.headers['content-type']).to.contain(
          'multipart/form-data; boundary'
        );
        return data;
      });

    const image = readFileSync(`${__dirname}/fixtures/image.png`);
    sendFile('/files', { image })
      .then((file) => {
        expect(file).to.exist;
        expect(file).to.exist;
        expect(file).to.be.eql(data);
        done(null, file);
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should fail if no data when send file', (done) => {
    sendFile('/files').catch((error) => {
      expect(error).to.exist;
      expect(error.message).to.be.equal('Missing Payload');
      done();
    });
  });

  it('should fetch file via http get request', (done) => {
    process.env.BASE_URL = 'https://127.0.0.1/v1/';
    nock(process.env.BASE_URL)
      .get('/files/5c1766243')
      .query(true)
      .reply(200, function onReply() {
        expect(this.req.headers).to.exist;
        return createReadStream(`${__dirname}/fixtures/image.png`);
      });

    fetchFile('/files/5c1766243')
      .then((file) => {
        expect(file).to.exist;
        done();
      })
      .catch((error) => {
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
