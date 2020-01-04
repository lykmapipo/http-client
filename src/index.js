import { isEmpty, omit } from 'lodash';
import axios from 'axios';
import { mergeObjects } from '@lykmapipo/common';

import {
  withDefaults,
  normalizeRequest,
  wrapRequest,
  isFormData,
  toFormData,
} from './utils';

// locals
let httpClient;

// export utils
export { isFormData, toFormData };

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
export const createHttpClient = optns => {
  // try create http client
  if (!httpClient) {
    // merge with given request options,
    // but: ignore baseURL to allow multi endpoints usage
    const clientOptions = omit(withDefaults(optns), 'baseURL');

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
export const disposeHttpClient = () => {
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
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * request('/users')
 *   .then(response => { ... })
 *   .catch(error => { ... });
 */
export const request = optns => {
  // ensure options,
  // also: ensure baseURL on requestOptions
  const requestOptions = withDefaults(optns);

  // ensure http client
  const client = createHttpClient(requestOptions);

  // TODO: create http agents

  // issue http(s) request
  return client.request(normalizeRequest(requestOptions));
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
export const spread = axios.spread; // eslint-disable-line

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
export const all = (...requests) => axios.all([...requests]);

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
export const del = (url, optns = {}) => {
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
export const get = (url, optns = {}) => {
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
export const head = (url, optns = {}) => {
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
export const options = (url, optns = {}) => {
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
export const patch = (url, data, optns = {}) => {
  if (isEmpty(data)) {
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
export const post = (url, data, optns = {}) => {
  if (isEmpty(data)) {
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
export const put = (url, data, optns = {}) => {
  if (isEmpty(data)) {
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
export const sendFile = (url, data, optns) => {
  if (!data || isEmpty(data)) {
    return Promise.reject(new Error('Missing Payload'));
  }
  const opts = mergeObjects(optns, { multipart: true });
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
export const fetchFile = (url, optns = {}) => {
  const opts = mergeObjects(optns, { responseType: 'stream' });
  const requestOptions = { method: 'GET', url, ...opts };
  return wrapRequest(request(requestOptions));
};
