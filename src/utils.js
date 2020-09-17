import http from 'http';
import https from 'https';
import { forEach, isEmpty, isFunction, startsWith, toLower } from 'lodash';
import FormData from 'form-data';
import {
  isNode,
  isValue,
  mergeObjects,
  safeMergeObjects,
  assign,
} from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';

export const CONTENT_TYPE = 'application/json';

export const RESPONSE_TYPE = 'json';

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
export const withDefaults = (optns) => {
  // merge defaults
  const options = safeMergeObjects(
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
export const createAgents = (optns) => {
  // refs
  let httpAgent;
  let httpsAgent;

  // create http agents, if node runtime
  if (isNode) {
    // create agents if there is options
    let { agentOptions = {} } = withDefaults(optns);
    if (!isEmpty(agentOptions)) {
      agentOptions = mergeObjects({ keepAlive: true }, agentOptions);
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
export const isFormData = (value) => {
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
export const toFormData = (data = {}) => {
  const form = new FormData();
  forEach(data, (value, key) => {
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
export const normalizeRequest = (request) => {
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
    startsWith(toLower(contentType), 'multipart') ||
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
    if (isFunction(data.getHeaders)) {
      delete headers['content-type'];
      delete headers['Content-Type'];
      extraHeaders = data.getHeaders();
    }
    headers = mergeObjects(headers, extraHeaders);
  }

  // ensure responseType
  responseType = isEmpty(responseType) ? RESPONSE_TYPE : responseType;

  // update request
  request.headers = headers;
  request.data = isValue(data) ? data : undefined;
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
export const mapResponseToData = (rawResponse) => rawResponse.data;

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
export const mapResponseToError = (rawResponse) => {
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
export const wrapRequest = (request, skipData = false) => {
  return request
    .then((response) => (skipData ? response : mapResponseToData(response)))
    .catch((response) => Promise.reject(mapResponseToError(response)));
};
