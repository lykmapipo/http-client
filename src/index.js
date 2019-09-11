import { isEmpty } from 'lodash';
import axios from 'axios';
import { withDefaults, wrapRequest } from './utils';

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
 * const httpClient = createHttpClient();
 */
export const createHttpClient = optns => {
  // try create http client
  if (!httpClient) {
    // merge with given request options
    const clientOptions = withDefaults(optns);

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
 * @returns {Promise} promise resolve with raw response on success or error
 * on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const getUsers = request('/users');
 * getUsers.then(response => { ... }).catch(error => { ... });
 */
export const request = optns => {
  // ensure options
  const requestOptions = withDefaults(optns);

  // ensure http client
  const client = createHttpClient(requestOptions);

  // issue http(s) request
  return client.request(requestOptions);
};

/**
 * @function del
 * @name del
 * @description Issue http delete request to specified url.
 * @param {string} url valid http path.
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with data on success or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const deleteUser = del('/users/5c1766243');
 * deleteUser.then(user => { ... }).catch(error => { ... });
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
 * @returns {Promise} promise resolve with data on success or error on failure.
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
 * const getUsers = get('/users', { params });
 * getUsers.then(users => { ... }).catch(error => { ... });
 *
 * // single
 * const getUser = get('/users/5c1766243');
 * getUser.then(user => { ... }).catch(error => { ... });
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
 * @returns {Promise} promise resolve with raw response on success or error
 * on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const headUser = head('/users/5c1766243');
 * headUser.then({ headers } => { ... }).catch(error => { ... });
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
 * @returns {Promise} promise resolve with raw response on success or error
 * on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const optionUser = options('/users/5c1766243');
 * optionUser.then({ headers } => { ... }).catch(error => { ... });
 */
export const options = (url, optns = {}) => {
  const requestOptions = { method: 'OPTIONS', url, ...optns };
  return wrapRequest(request(requestOptions), true);
};

/**
 * @function post
 * @name post
 * @description Issue http post request to specified url.
 * @param {string} url valid http path.
 * @param {object} data request payload to be encoded on http request body
 * @param {object} [optns={}] valid request options.
 * @returns {Promise} promise resolve with data on success or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const postUser = post('/users', { age: 14 });
 * postUser.then(user => { ... }).catch(error => { ... });
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
 * @returns {Promise} promise resolve with data on success or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const putUser = put('/users', { age: 14 });
 * putUser.then(user => { ... }).catch(error => { ... });
 */
export const put = (url, data, optns = {}) => {
  if (isEmpty(data)) {
    return Promise.reject(new Error('Missing Payload'));
  }
  const requestOptions = { method: 'PUT', url, data, ...optns };
  return wrapRequest(request(requestOptions));
};
