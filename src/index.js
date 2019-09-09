import axios from 'axios';
import { withDefaults } from './utils';

// locals
let httpClient;

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

export const disposeHttpClient = () => {};
