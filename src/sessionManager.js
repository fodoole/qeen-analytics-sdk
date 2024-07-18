/**
 * @file sessionManager.js
 * @description The session manager script for Fodoole Analytics SDK.
 */

import { Config, State, getContentEndpoint } from './config.js';
import { PageAnalyticsEvent, fetchContentParams } from './models.js';
import { InvalidParameterError, NoFodooleError, ResponseNotOkError } from './errors.js';
import { bindScrollEvents, bindTabEvents, bindIdleTimeEvents, resetIdleTimer } from './pageEvents.js';
import { onLoad, beforeUnload, randInt, limit, Debouncer } from './utils.js';

/**
  * Function that implements common logic for resetting the session state.
  * This function is called when a session is initialised or reset.
  * @param {string} label The label for the page view event.
  */
function initResetCommon(label) {
  // Manage state
  if (label === 'RESET') {
    State.isResetSession = true;
  }
  State.sessionId = String(randInt());

  // Instantiate idle timer
  resetIdleTimer(Config.idleTime);

  // Log the page view and content served events
  function logPageView() {
    new PageAnalyticsEvent('PAGE_VIEW', null, label, null);
    if (!State.contentServed && Config.isPdp && Config.contentServingId !== '0') {
      new PageAnalyticsEvent('CONTENT_SERVED', Config.contentServingId, null, null);
      State.contentServed = true;
    }
  }

  // Only send the page view event if the page is visible
  if (document.visibilityState === 'visible') {
    logPageView();
  } else { // If the page is not visible, wait for it to become visible
    document.addEventListener('visibilitychange', function logVisibleEvent() {
      State.lastTabExitTime = Date.now();
      if (document.visibilityState === 'visible') {
        logPageView();
        document.removeEventListener('visibilitychange', logVisibleEvent);
      }
    });
  }
}

/**
 * Function that initializes a page session.
 * This function is called when the page is loaded.
 */
function initSession() {
  // Reset session data
  State.reset();
  State.sessionId = String(randInt());

  onLoad(function (_) {
    // Common initialization logic
    initResetCommon('INIT');

    // Bind tab and idle time events
    bindTabEvents();
    bindIdleTimeEvents(Config.idleTime);

    // Fire any debounced events on page exit and send PAGE_EXIT event
    beforeUnload(function (_) {
      // trigger any remaining debounced events
      Debouncer.flushAll();

      // Send a PAGE_EXIT event
      new PageAnalyticsEvent('PAGE_EXIT', null, null, null);
    });
  });
}

/**
 * Resets the session by resetting the state This is mainly used when a user
 * returns to the page after a long period of time or when idle time is hit
 * while user is still on the page.
 */
export function resetSession() {
  // Reset session id and session data
  State.reset();
  // Rebind intersection observer for scroll events
  bindScrollEvents(Config.scrollEvents);

  initResetCommon('RESET');
}

/**
 * Prepare selectors for the content rendering or replacement.
 * @param {Object[]} rawContent - The raw content to be prepared.
 * @returns {Object} - The content selectors.
 */
function prepareSelectors(rawContent) {
  let contentSelectors = {};
  rawContent.forEach(entry => {
    contentSelectors[entry.path] = entry.value;
  });

  return contentSelectors;
}

/**
 * Function to fetch Fodoole content.
 * @param {string} userDeviceId - The user device ID.
 * @returns {Promise} - The promise object representing the response.
 * @property {Object} contentSelectors - The content selectors and content.
 * @throws {InvalidParameterError} - Throws an error if the user device ID is not provided.
 * @throws {ResponseNotOkError} - Throws an error if the response is not OK.
 * @throws {NoFodooleError} - Throws an error if the URL contains #no-fodoole.
 */
export async function fetchContent(userDeviceId) {
  try {
    if (!userDeviceId) {
      throw new InvalidParameterError('User device ID is required.');
    }
    if (window.location.hash.includes('no-fodoole')) {
      throw new NoFodooleError('Fodoole is disabled; URL contains #no-fodoole');
    }

    const params = new fetchContentParams(userDeviceId);
    const response = await fetch(`${getContentEndpoint}?${params.toString()}`);
    if (!response.ok) {
      throw new ResponseNotOkError(response.status, response.statusText, response.url);
    }
    const data = await response.json();
    data.contentSelectors = prepareSelectors(data.rawContentSelectors)
    // Save the content in the config object for frontend investigation and debugging
    Config.rawContentSelectors = data.rawContentSelectors;
    Config.contentSelectors = data.contentSelectors;
    return data;
  } catch (error) {
    console.error('Failed to get Fodoole content:', error);
    throw error;
  }
}

/**
 * Function that initializes the Fodoole Analytics SDK.
 * @param {Object} config - The configuration object for the Fodoole Analytics SDK.
 * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set.
 */
export function initPageSession(config) {
  Config.analyticsEndpoint = config.analyticsEndpoint || '';
  Config.projectId = config.projectId || '0';
  Config.contentServingId = config.contentServingId || '0';
  Config.contentId = config.contentId || '-';
  Config.isPdp = config.isPdp || false;
  // Config.idleTime = limit(config.idleTime, 60_000, 599_000, 300_000); 
  Config.idleTime = limit(config.idleTime, 1_000, 599_000, 300_000); // FIXME: debug testing 
  Config.clickEvents = Config.clickEvents || new Set();
  Config.scrollEvents = Config.scrollEvents || new Set();
  initSession();
}