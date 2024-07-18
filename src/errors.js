/**
 * @file errors.js
 * @description The error classes for Fodoole Analytics SDK.
 */

/**
 * Error class for invalid parameters.
 * @class InvalidParameterError
 * @extends Error
 * @param {string} message - The error message.
 */
export class InvalidParameterError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidParameterError';
  }
}

/**
 * Error class for unset analytics endpoint.
 * @class AnalyticsEndpointError
 * @extends Error
 * @param {string} message - The error message.
 */
export class AnalyticsEndpointError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AnalyticsEndpointError';
  }
}

/**
 * Error class for if the URL contains #no-fodoole.
 * @class NoFodooleError
 * @extends Error
 * @param {string} message - The error message.
 */
export class URLContainsNoFodooleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'URLContainsNoFodooleError';
  }
}

/**
 * Error class for response not OK.
 * @class ResponseNotOkError
 * @extends Error
 * @param {number} status - The status code of the response.
 * @param {string} statusText - The status text of the response.
 * @param {string} url - The URL of the request.
 */
export class ResponseNotOkError extends Error {
  constructor(status, statusText, url) {
    super(`Request to ${url} failed with status ${status}: ${statusText}`);
    this.name = "ResponseNotOkError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}
