/**
 * @file idleEvents.js
 * @description The idle events script for Fodoole Analytics SDK.
 */

import { State } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { resetSession } from './sessionManager.js';

/**
 * This function instantiates and resets the idle timer when a user interacts with the page. 
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle.
 */
export function resetIdleTimer(idleThreshold) {
  clearTimeout(State.idleTimer);
  if (!document.hidden) {
    State.idleTimer = setTimeout(function () {
      /* sometimes the timer can be created while the page is in view, but fires
         after the page is hidden; this should ensure that tab switches don't
         trigger a session to reset twice
      */
      const idleTimeExceeded = Date.now() - State.lastIdleTime >= idleThreshold;
      if (!document.hidden && idleTimeExceeded) {
        new PageAnalyticsEvent('IDLE', idleThreshold, null, null);
        State.lastIdleTime = Date.now();
        // Reset the session
        resetSession();
      }
    }, idleThreshold);
  }
}

/**
 * This function binds idle time events to the document object.
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle.
 */
export function bindIdleTimeEvents(idleThreshold) {
  ['mousemove', 'keypress', 'touchmove', 'scroll', 'click', 'keyup', 'touchstart', 'touchend', 'visibilitychange'].forEach(function (event) { document.addEventListener(event, function () { resetIdleTimer(idleThreshold); }); });
}
