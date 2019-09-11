import { isEmpty } from 'lodash';
import axios from 'axios';
import { mergeObjects, assign } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';

/**
 * @name CONTENT_TYPE
 * @constant
 * @default application/json
 * @description supported content type
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @ignore
 */
const CONTENT_TYPE = 'application/json';

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
const withDefaults = optns => {
  // merge defaults
  const options = mergeObjects(
    {
      baseURL: getString('BASE_URL') || getString('REACT_APP_BASE_URL'),
      headers: { Accept: CONTENT_TYPE, 'Content-Type': CONTENT_TYPE },
    },
    optns
  );

  // return options
  return options;
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
const mapResponseToData = rawResponse => rawResponse.data;

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
const mapResponseToError = rawResponse => {
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
  assign(error, { code, status, message, description, errors, ...data });

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
    .then(response => (skipData ? response : mapResponseToData(response)))
    .catch(response => Promise.reject(mapResponseToError(response)));
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
 * const httpClient = createHttpClient();
 */
const createHttpClient = optns => {
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
const disposeHttpClient = () => {
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
const request = optns => {
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
 * @returns {Promise} promise resolve with data on success or error on failure.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const patchUser = patch('/users', { age: 14 });
 * patchUser.then(user => { ... }).catch(error => { ... });
 */
const patch = (url, data, optns = {}) => {
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
const post = (url, data, optns = {}) => {
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
const put = (url, data, optns = {}) => {
  if (isEmpty(data)) {
    return Promise.reject(new Error('Missing Payload'));
  }
  const requestOptions = { method: 'PUT', url, data, ...optns };
  return wrapRequest(request(requestOptions));
};

export { createHttpClient, del, disposeHttpClient, get, head, options, patch, post, put, request };
