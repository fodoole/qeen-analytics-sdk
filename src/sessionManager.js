import { Config, State } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { bindClickEvents } from './clickEvents.js';
import { bindIdleTimeEvents } from './idleEvents.js';
import { bindScrollEvents } from './scrollEvents.js';
import { bindTabEvents } from './tabEvents.js';
import { resetIdleTimer } from './idleEvents.js';
import { onLoad, beforeUnload, randInt, Debouncer, BodyMutationObserverManager } from './utils.js';

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

  // Bind scroll events
  bindScrollEvents(Config.scrollEvents);

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
export function initSession() {
  // Reset session data
  State.reset();
  State.sessionId = String(randInt());

  onLoad(function (_) {
    // Common initialization logic
    initResetCommon('INIT');

    // Bind non-scroll events
    bindClickEvents(Config.clickEvents);
    bindIdleTimeEvents(Config.idleTime);
    bindTabEvents();

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
  initResetCommon('RESET');
}

/**
 * Function that initializes the Fodoole Analytics SDK.
 * @param {Object} config - The configuration object for the Fodoole Analytics SDK.
 */
export function initFodooleAnalytics(config)
{
  Config.analyticsEndpoint = config.analyticsEndpoint || ''; // FIXME: this should be from the fetch function
  Config.projectId = config.projectId || '0'; // FIXME: this should be from the fetch function
  Config.contentServingId = config.contentServingId || '0';
  Config.contentId = config.contentId || '-';
  Config.isPdp = config.isPdp || false;
  Config.idleTime = config.idleTime || 300_000; // TODO: limit between 1m and 10m
  Config.clickEvents = config.clickEvents || []; // FIXME: maybe make this manual
  Config.scrollEvents = config.scrollEvents || []; // FIXME: maybe make this manual
  BodyMutationObserverManager.init(); // FIXME: maybe remove
  initSession();
}