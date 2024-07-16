import { config, state } from './config.js';
import { PageAnalyticsEvent } from './models.js';

/**
 * This function checks if the tab switch causes a session reset.
 * @return {boolean} - True if the tab switch causes a session reset, false otherwise.
 */
function tabSwitchCausesReset() {
  const exitReturnDiff = Date.now() - state.lastTabExitTime;
  return exitReturnDiff >= config.idleTime;
}

/**
 * This function binds tab switch events to the document object.
 */
export function bindTabEvents() {
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      state.lastTabExitTime = Date.now();
      new PageAnalyticsEvent('TAB_SWITCH', null, 'EXIT', null);
    } else {
      if (tabSwitchCausesReset()) {
        fodoole.resetSession(); // FIXME
      } else {
        new PageAnalyticsEvent('TAB_SWITCH', null, 'RETURN', null);
      }
    }
  });
}
