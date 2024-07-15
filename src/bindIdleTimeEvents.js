/**
 * This function instantiates and resets the idle timer when a user interacts
 * with the page. 
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle
 */
fodoole.resetIdleTimer = function (idleThreshold) {
  clearTimeout(fodoole.state.idleTimer);
  if (!document.hidden) {
    fodoole.state.idleTimer = setTimeout(function () {
      // Register an idle event
      const event = new fodoole.PageAnalyticsEvent('IDLE', idleThreshold, null, null);
      // sometimes the timer can be created while the page is in view, but fires
      // after the page is hidden; this should ensure that tab switches don't
      // trigger a session to reset twice
      const idleTimeExceeded = Date.now() - fodoole.state.lastIdleTime >= idleThreshold;
      if (!document.hidden && idleTimeExceeded) {
        event.pushEvent();

        fodoole.state.lastIdleTime = Date.now();

        // Reset the session
        fodoole.resetSession();
      }
    }, idleThreshold);
  }
};

/**
 * This function binds idle time events to the document object.
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle
 */
fodoole.bindIdleTimeEvents = function (idleThreshold) {
  // Resets the idle timer to 0
  function resetIdleTimer() {
    fodoole.resetIdleTimer(idleThreshold);
  }

  // these events are considered user activity
  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('keypress', resetIdleTimer);
  document.addEventListener('touchmove', resetIdleTimer);
  document.addEventListener('scroll', resetIdleTimer);
  document.addEventListener('click', resetIdleTimer);
  document.addEventListener('keyup', resetIdleTimer);
  document.addEventListener('touchstart', resetIdleTimer);
  document.addEventListener('touchend', resetIdleTimer);
  document.addEventListener('visibilitychange', resetIdleTimer);
};
