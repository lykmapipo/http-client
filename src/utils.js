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
export const CONTENT_TYPE = 'application/json';

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
export const withDefaults = optns => {
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
export const mapResponseToData = rawResponse => rawResponse.data;

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
export const mapResponseToError = rawResponse => {
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
