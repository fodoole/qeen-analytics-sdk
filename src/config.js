/**
 * @file config.js
 * @description The configuration objects for Fodoole Analytics SDK.
 */

/**
 * @constant {string} getContentEndpoint - The endpoint to fetch content.
 */
export const getContentEndpoint = ''; // FIXME: add the endpoint

/**
 * @class Config
 * @description The configuration class for Fodoole Analytics SDK.
 * @property {string} analyticsEndpoint - The endpoint for the analytics server.
 * @property {string} projectId - The project ID.
 * @property {string} contentServingId - The content serving ID; default is '0'.
 * @property {string} contentId - The content ID; default is '-'.
 * @property {boolean} isPdp - The product detail page flag; default is false.
 * @property {number} idleTime - The idle time in milliseconds; default is 5 minutes.
 * @property {Array} clickEvents - The click events array.
 * @property {Array} scrollEvents - The scroll events array.
 */
export class Config { }

/**
 * @class State
 * @description The state class for Fodoole Analytics SDK.
 * @property {boolean} contentServed - The content served flag.
 * @property {string} sessionId - The session ID.
 * @property {boolean} isResetSession - The reset session flag.
 * @property {number} debounceTime - The debounce time in milliseconds.
 * @property {number} idleTimer - The idle timer.
 * @property {number} lastIdleTime - The last idle time.
 * @property {string} fodooleDeviceId - The Fodoole device ID.
 * @property {number} lastTabExitTime - The last tab exit time.
 * @property {Set} scrollObservedElements - The set of scroll observed elements.
 */
export class State {
  static reset() {
    State.contentServed = false;
    State.sessionId = null;
    State.isResetSession = false;
    State.debounceTime = 500;
    State.idleTimer = null;
    State.lastIdleTime = Date.now();
    State.fodooleDeviceId = null;
    State.lastTabExitTime = 0;
    State.scrollObservedElements = new Set();
  }
}
