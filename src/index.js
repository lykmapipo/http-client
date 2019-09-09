import axios from 'axios';
import { withDefaults } from './utils';

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
 * const optns = { baseUrl: ... };
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

export const disposeHttpClient = () => {};
