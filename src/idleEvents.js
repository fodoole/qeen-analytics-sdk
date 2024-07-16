import { PageAnalyticsEvent } from './models.js';

/**
 * This function instantiates and resets the idle timer when a user interacts
 * with the page. 
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle
 */
export function resetIdleTimer(idleThreshold) {
  clearTimeout(fodoole.state.idleTimer);
  if (!document.hidden) {
    fodoole.state.idleTimer = setTimeout(function () {
      // Register an idle event
      const event = new PageAnalyticsEvent('IDLE', idleThreshold, null, null);
      /* sometimes the timer can be created while the page is in view, but fires
         after the page is hidden; this should ensure that tab switches don't
         trigger a session to reset twice
      */
      const idleTimeExceeded = Date.now() - fodoole.state.lastIdleTime >= idleThreshold;
      if (!document.hidden && idleTimeExceeded) {
        event.pushEvent();
        fodoole.state.lastIdleTime = Date.now();
        // Reset the session
        fodoole.resetSession(); // FIXME
      }
    }, idleThreshold);
  }
}

/**
 * This function binds idle time events to the document object.
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle
 */
export function bindIdleTimeEvents(idleThreshold) {
  ['mousemove', 'keypress', 'touchmove', 'scroll', 'click', 'keyup', 'touchstart', 'touchend', 'visibilitychange'].forEach(function (event) { document.addEventListener(event, function () { resetIdleTimer(idleThreshold); }); });
}

export { resetIdleTimer, bindIdleTimeEvents };
