import axios from 'axios';
import { mergeObjects } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';

// locals
let httpClient;

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
 * const options = withDefaults(optns)
 * // => {baseUrl: ..., headers: { ... } };
 */
export const withDefaults = optns => {
  // merge defaults
  const options = mergeObjects(
    {
      baseUrl: getString('BASE_URL') || getString('REACT_APP_BASE_URL'),
    },
    optns
  );

  // return options
  return options;
};

/**
 * @function createHttpClient
 * @name createHttpClient
 * @description create an http client if not exists
 * @param {object} [optns] valid http client options
 * @returns {object} new instance of http client
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const httpClient = createHttpClient();
 */
export const createHttpClient = optns => {
  // try create http client
  if (!httpClient) {
    // merge with given request options
    const options = withDefaults(optns);

    // create http client
    httpClient = axios.create(options);
    httpClient.id = Date.now();
  }

  // return http client
  return httpClient;
};
