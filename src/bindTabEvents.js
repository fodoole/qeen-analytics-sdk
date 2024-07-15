/**
 * This function checks if the tab switch causes a session reset.
 * @return {boolean} - True if the tab switch causes a session reset, false otherwise.
 */
fodoole.tabSwitchCausesReset = function () {
  const exitReturnDiff = Date.now() - fodoole.state.lastTabExitTime;
  return exitReturnDiff >= fodoole.config.idleTime;
};

/**
 * This function binds tab switch events to the document object.
 */
fodoole.bindTabEvents = function () {
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      fodoole.state.lastTabExitTime = Date.now();
      const event = new fodoole.PageAnalyticsEvent('TAB_SWITCH', null, 'EXIT', null);
      event.pushEvent();
    } else {
      if (fodoole.tabSwitchCausesReset()) {
        fodoole.resetSession();
      } else {
        const event = new fodoole.PageAnalyticsEvent('TAB_SWITCH', null, 'RETURN', null);
        event.pushEvent();
      }
    }
  });
};
