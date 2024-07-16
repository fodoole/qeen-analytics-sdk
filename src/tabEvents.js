import { PageAnalyticsEvent } from './models.js';

/**
 * This function checks if the tab switch causes a session reset.
 * @return {boolean} - True if the tab switch causes a session reset, false otherwise.
 */
function tabSwitchCausesReset() {
  const exitReturnDiff = Date.now() - fodoole.state.lastTabExitTime;
  return exitReturnDiff >= fodoole.config.idleTime;
}

/**
 * This function binds tab switch events to the document object.
 */
export function bindTabEvents() {
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      fodoole.state.lastTabExitTime = Date.now();
      const event = new PageAnalyticsEvent('TAB_SWITCH', null, 'EXIT', null);
      event.pushEvent();
    } else {
      if (tabSwitchCausesReset()) {
        fodoole.resetSession(); // FIXME
      } else {
        const event = new PageAnalyticsEvent('TAB_SWITCH', null, 'RETURN', null);
        event.pushEvent();
      }
    }
  });
}

export { bindTabEvents };
