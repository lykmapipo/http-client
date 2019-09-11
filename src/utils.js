import { mergeObjects } from '@lykmapipo/common';
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
 * const options = withDefaults(optns)
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
 * @param {object} response axios http response
 * @returns {object} response data
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const data = mapResponseToData(httpResponse).
 * // => { .. };
 */
export const mapResponseToData = response => response.data;
