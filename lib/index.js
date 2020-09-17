'use strict';

const lodash = require('lodash');
const axios = require('axios');
const common = require('@lykmapipo/common');
const http = require('http');
const https = require('https');
const FormData = require('form-data');
const env = require('@lykmapipo/env');

const CONTENT_TYPE = 'application/json';

const RESPONSE_TYPE = 'json';

/**
 * @function withDefaults
 * @name withDefaults
 * @description Merge provided options with defaults.
 * @param {object} [optns] provided options
 * @returns {object} merged options
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const optns = { baseUrl: ... };
 * const options = withDefaults(optns);
 * // => {baseUrl: ..., headers: { ... } };
 */
const withDefaults = (optns) => {
  // merge defaults
  const options = common.safeMergeObjects(
    {
      baseURL: env.getString('BASE_URL') || env.getString('REACT_APP_BASE_URL'),
      headers: { Accept: CONTENT_TYPE, 'Content-Type': CONTENT_TYPE },
    },
    optns
  );

  // return options
  return options;
};

/**
 * @function createAgents
 * @name createAgents
 * @description Create http or https agent from options.
 * @param {object} [optns] provided request options
 * @param {object} [optns.agentOptions] valid http(s) agent options
 * @param {string} [optns.agentOptions.ca] valid ca
 * @param {string} [optns.agentOptions.cert] valid cert
 * @param {string} [optns.agentOptions.key] valid key
 * @param {string} [optns.agentOptions.passphrase] valid passphrase
 * @returns {object} valid http or https agent
 * @see {@link https://github.com/request/request#using-optionsagentoptions}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const optns = {
 *  agentOptions: {
 *   cert: fs.readFileSync(certFilePath),
 *   key: fs.readFileSync(keyFilePath),
 *   passphrase: 'password',
 *   ca: fs.readFileSync(caFilePath),
 *   ...
 *  }
 * };
 *
 * const options = createAgents(optns);
 * // => { httpAgent: ..., httpsAgent: ... };
 */
const createAgents = (optns) => {
  // refs
  let httpAgent;
  let httpsAgent;

  // create http agents, if node runtime
  if (common.isNode) {
    // create agents if there is options
    let { agentOptions = {} } = withDefaults(optns);
    if (!lodash.isEmpty(agentOptions)) {
      agentOptions = common.mergeObjects({ keepAlive: true }, agentOptions);
      httpAgent = new http.Agent(agentOptions);
      httpsAgent = new https.Agent(agentOptions);
    }
  }

  // return agents
  return { httpAgent, httpsAgent };
};

/**
 * @function isFormData
 * @name isFormData
 * @description Determine if a value is a FormData
 * @param {*} value data to test
 * @returns {boolean} true if value is an FormData, otherwise false
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isFormData({});
 * // => false;
 *
 * * isFormData(new FormData());
 * // => true;
 */
const isFormData = (value) => {
  return typeof FormData !== 'undefined' && value instanceof FormData;
};

/**
 * @function toFormData
 * @name toFormData
 * @description Convert given plain object to form data instance
 * @param {object} [data={}] valid data
 * @returns {object} valid form data instance
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const data = toFormData({ ... });
 * // => FormData{ ... };
 */
const toFormData = (data = {}) => {
  const form = new FormData();
  lodash.forEach(data, (value, key) => {
    if (key && value) {
      // TODO: handle object value
      form.append(key, value);
    }
  });
  return form;
};

/**
 * @function normalizeRequest
 * @name normalizeRequest
 * @description Normalize http request with sensible config
 * @param {object} [request={}] valid request options
 * @returns {object} normalize request options
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const request = normalizeRequest({ ... }).
 * // => { ... };
 */
const normalizeRequest = (request) => {
  // obtaion request parts
  let {
    responseType = RESPONSE_TYPE,
    headers = {},
    data = {},
    multipart = false,
  } = request;

  // check for multipart
  const contentType = headers['content-type'] || headers['Content-Type'];
  multipart =
    multipart ||
    lodash.startsWith(lodash.toLower(contentType), 'multipart') ||
    isFormData(data);

  // check for multipart flag
  if (multipart) {
    if (!isFormData(data)) {
      data = toFormData(data);
    }
  }

  // handle form data
  if (isFormData(data)) {
    let extraHeaders = {};
    if (lodash.isFunction(data.getHeaders)) {
      delete headers['content-type'];
      delete headers['Content-Type'];
      extraHeaders = data.getHeaders();
    }
    headers = common.mergeObjects(headers, extraHeaders);
  }

  // ensure responseType
  responseType = lodash.isEmpty(responseType) ? RESPONSE_TYPE : responseType;

  // update request
  request.headers = headers;
  request.data = common.isValue(data) ? data : undefined;
  request.responseType = responseType;

  // return normalize request
  return request;
};

/**
 * @function mapResponseToData
 * @name mapResponseToData
 * @description Convert raw http response to data
 * @param {object} rawResponse raw http response
 * @returns {object} response data
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const data = mapResponseToData(rawResponse).
 * // => { .. };
 */
const mapResponseToData = (rawResponse) => rawResponse.data;

/**
 * @function mapResponseToError
 * @name mapResponseToError
 * @description Convert raw http response error to js native error
 * @param {object} rawResponse raw http response
 * @returns {Error} response error
 * @see {@link https://github.com/axios/axios#handling-errors}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const error = mapResponseToError(rawResponse).
 * // => Error;
 */
const mapResponseToError = (rawResponse) => {
  // obtain error details
  let { code, status, message, description, stack, errors, data } = rawResponse;
  const { request, response } = rawResponse;

  // handle server response error
  if (response) {
    code = response.code || code;
    status = response.status || status;
    data = response.data || data || {};
    message = data.message || response.statusText || message;
    description = description || message;
    errors = response.errors || errors || {};
    stack = response.stack || data.stack || stack;
  }

  // handle server not responding error
  else if (request) {
    code = code || 503;
    status = status || 503;
    description = description || 'Service Unavailable';
    message = message || description;
  }

  // handle request setup error
  else {
    code = code || 400;
    status = status || 400;
    description = description || 'Bad Request';
    message = message || description;
  }

  // initialize error
  const error = new Error(message);
  error.stack = stack;

  // update error object
  common.assign(error, { code, status, message, description, errors, ...data });

  // return normalized native error
  return error;
};

/**
 * @function wrapRequest
 * @name wrapRequest
 * @description Wrap http request and convert raw response to error or data
 * @param {Promise} request valid http request
 * @param {boolean} [skipData=false] whether to skip map raw response to data
 * @returns {Promise} request with normalized response error and data
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const wrappedRequest = wrapRequest(request).
 * // => Promise;
 */
const wrapRequest = (request, skipData = false) => {
  return request
    .then((response) => (skipData ? response : mapResponseToData(response)))
    .catch((response) => Promise.reject(mapResponseToError(response)));
};

// locals
let httpClient;

/**
 * @function createHttpClient
 * @name createHttpClient
 * @description Create http client if not exists
 * @param {object} [optns] valid http client options
 * @returns {object} instance of http client
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const optns = { baseURL: ... };
 * const httpClient = createHttpClient(optns);
 */
const createHttpClient = (optns) => {
  // try create http client
  if (!httpClient) {
    // merge with given request options,
    // but: ignore baseURL to allow multi endpoints usage
    const clientOptions = lodash.omit(withDefaults(optns), 'baseURL');

    // create http client
    httpClient = axios.create(clientOptions);
    httpClient.id = Date.now();
  }

  // return http client
  return httpClient;
};

/**
 * @function disposeHttpClient
 * @name disposeHttpClient
 * @description Clear current http client in use.
 * @returns {object} null if client clear otherwise existing client;
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const httpClient = disposeHttpClient();
 * // => null
 */
const disposeHttpClient = () => {
  httpClient = null;
  return httpClient;
};

/**
 * @function request
 * @name request
 * @description Issue http request using given options.
 * @param {object} optns valid request options
 * @returns {Promise} promise resolve with raw http response on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.2.0
 * @static
 * @public
 * @example
 *
 * request('/users')
 *   .then(response => { ... })
 *   .catch(error => { ... });
 */
const request = (optns) => {
  // ensure options,
  // also: ensure baseURL on requestOptions
  const options = withDefaults(optns);

  // ensure http client
  const client = createHttpClient(options);

  // create http agents
  const agents = createAgents(options);

  // prepare request options
  const requestOptions = common.safeMergeObjects(options, agents);

  // normalize request
  const normalizedRequest = normalizeRequest(requestOptions);

  // issue http(s) request
  return client.request(normalizedRequest);
};

/**
 * @function spread
 * @name spread
 * @description Flattened array fullfillment to the formal parameters of
 * the fulfillment handler.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const getRoles = get('/roles');
 * const getUsers = get('/users');
 * const requests = all(getRoles(), getUsers());
 * request.then(spread((roles, users) => { ... }));
 */
const spread = axios.spread; // eslint-disable-line

/**
 * @function all
 * @name all
 * @description Performing multiple concurrent http requests.
 * @param {object[]} requests valid http requests
 * @returns {Promise} promise resolve with http response on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const getRoles = get('/roles');
 * const getUsers = get('/users');
 * const requests = all(getRoles(), getUsers());
 * request.then(spread((roles, users) => { ... }));
 */
const all = (...requests) => axios.all([...requests]);

/**
 * @function del
 * @name del
 * @description Issue http delete request to specified url.
 * @param {string} url valid http path.
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with data on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * del('/users/5c1766243')
 *   .then(user => { ... })
 *   .catch(error => { ... });
 */
const del = (url, optns = {}) => {
  const requestOptions = { method: 'DELETE', url, ...optns };
  return wrapRequest(request(requestOptions));
};

/**
 * @function get
 * @name get
 * @description Issue http get request to specified url.
 * @param {string} url valid http path.
 * @param {object} [optns={}] valid request options.
 * @param {object} [optns.params] params that will be encoded into url
 * query params.
 * @returns {Promise} promise resolve with data on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * // list
 * const params = { age: { $in: [1, 2] } };
 * get('/users', { params })
 *   .then(users => { ... })
 *   .catch(error => { ... });
 *
 * // single
 * get('/users/5c1766243')
 *   .then(user => { ... })
 *   .catch(error => { ... });
 */
const get = (url, optns = {}) => {
  const requestOptions = { method: 'GET', url, ...optns };
  return wrapRequest(request(requestOptions));
};

/**
 * @function head
 * @name head
 * @description Issue http head request to specified url.
 * @param {string} url valid http path.
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with raw http response on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * head('/users/5c1766243')
 *   .then({ headers } => { ... })
 *   .catch(error => { ... });
 */
const head = (url, optns = {}) => {
  const requestOptions = { method: 'HEAD', url, ...optns };
  return wrapRequest(request(requestOptions), true);
};

/**
 * @function options
 * @name options
 * @description Issue http options request to specified url.
 * @param {string} url valid http path.
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with raw http response on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * options('/users/5c1766243')
 *   .then({ headers } => { ... })
 *   .catch(error => { ... });
 */
const options = (url, optns = {}) => {
  const requestOptions = { method: 'OPTIONS', url, ...optns };
  return wrapRequest(request(requestOptions), true);
};

/**
 * @function patch
 * @name patch
 * @description Issue http patch request to specified url.
 * @param {string} url valid http path.
 * @param {object} data request payload to be encoded on http request body
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with data on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * // json request
 * patch('/users/5c1766243', { age: 14 })
 *   .then(user => { ... })
 *   .catch(error => { ... });
 *
 * // multipart request
 * patch('/users/5c1766243', { age: 14 }, { multipart: true })
 *   .then(user => { ... })
 *   .catch(error => { ... });
 *
 * // multipart request using form data
 * const form = new FormData()
 * patch('/users/5c1766243', form)
 *   .then(user => { ... })
 *   .catch(error => { ... });
 */
const patch = (url, data, optns = {}) => {
  if (lodash.isEmpty(data)) {
    return Promise.reject(new Error('Missing Payload'));
  }
  const requestOptions = { method: 'PATCH', url, data, ...optns };
  return wrapRequest(request(requestOptions));
};

/**
 * @function post
 * @name post
 * @description Issue http post request to specified url.
 * @param {string} url valid http path.
 * @param {object} data request payload to be encoded on http request body
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with data on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * // json request
 * post('/users', { age: 14 })
 *   .then(user => { ... })
 *   .catch(error => { ... });
 *
 * // multipart request
 * post('/users', { age: 14 }, { multipart: true })
 *   .then(user => { ... })
 *   .catch(error => { ... });
 *
 * // multipart request using form data
 * const form = new FormData()
 * post('/users', form)
 *   .then(user => { ... })
 *   .catch(error => { ... });
 */
const post = (url, data, optns = {}) => {
  if (lodash.isEmpty(data)) {
    return Promise.reject(new Error('Missing Payload'));
  }
  const requestOptions = { method: 'POST', url, data, ...optns };
  return wrapRequest(request(requestOptions));
};

/**
 * @function put
 * @name put
 * @description Issue http put request to specified url.
 * @param {string} url valid http path.
 * @param {object} data request payload to be encoded on http request body
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with data on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * // json request
 * put('/users/5c1766243', { age: 14 })
 *   .then(user => { ... })
 *   .catch(error => { ... });
 *
 * // multipart request
 * put('/users/5c1766243', { age: 14 }, { multipart: true })
 *   .then(user => { ... })
 *   .catch(error => { ... });
 *
 * // multipart request using form data
 * const form = new FormData()
 * put('/users/5c1766243', form)
 *   .then(user => { ... })
 *   .catch(error => { ... });
 */
const put = (url, data, optns = {}) => {
  if (lodash.isEmpty(data)) {
    return Promise.reject(new Error('Missing Payload'));
  }
  const requestOptions = { method: 'PUT', url, data, ...optns };
  return wrapRequest(request(requestOptions));
};

/**
 * @function sendFile
 * @name sendFile
 * @description Issue http multipart request to specified url.
 * @param {string} url valid http path.
 * @param {object} data request payload to be encoded on http request body
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with data on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * // send stream
 * const image = fs.createReadStream(imagePath);
 * sendFile('/files', { image })
 *   .then(file => { ... })
 *   .catch(error => { ... });
 *
 * // send buffer
 * const image = fs.readFileSync(imagePath);
 * sendFile('/files/5c1766243', { image }, { method: 'PATCH'})
 *   .then(file => { ... })
 *   .catch(error => { ... });
 *
 * // send form data
 * const image = document.getElementById('file').files[0];
 * sendFile('/files', { image })
 *   .then(file => { ... })
 *   .catch(error => { ... });
 */
const sendFile = (url, data, optns) => {
  if (!data || lodash.isEmpty(data)) {
    return Promise.reject(new Error('Missing Payload'));
  }
  const opts = common.mergeObjects(optns, { multipart: true });
  const requestOptions = { method: 'POST', url, data, ...opts };
  return wrapRequest(request(requestOptions));
};

/**
 * @function fetchFile
 * @name fetchFile
 * @description Issue http get request to fetch file from given url.
 * @param {string} url valid http path.
 * @param {object} [optns={}] valid request options.
 * @param {object} [optns.params] params that will be encoded into url
 * query params.
 * @returns {Promise} promise resolve with file stream on success
 * or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * fetchFile('/files/5c1766243')
 *   .then(stream => { ... })
 *   .catch(error => { ... });
 */
const fetchFile = (url, optns = {}) => {
  const opts = common.mergeObjects(optns, { responseType: 'stream' });
  const requestOptions = { method: 'GET', url, ...opts };
  return wrapRequest(request(requestOptions));
};

exports.all = all;
exports.createHttpClient = createHttpClient;
exports.del = del;
exports.disposeHttpClient = disposeHttpClient;
exports.fetchFile = fetchFile;
exports.get = get;
exports.head = head;
exports.isFormData = isFormData;
exports.options = options;
exports.patch = patch;
exports.post = post;
exports.put = put;
exports.request = request;
exports.sendFile = sendFile;
exports.spread = spread;
exports.toFormData = toFormData;
