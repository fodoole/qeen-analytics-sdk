import { Config, State } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { resetSession } from './sessionManager.js';

/**
 * This function checks if the tab switch causes a session reset.
 * @return {boolean} - True if the tab switch causes a session reset, false otherwise.
 */
function tabSwitchCausesReset() {
  const exitReturnDiff = Date.now() - State.lastTabExitTime;
  return exitReturnDiff >= Config.idleTime;
}

/**
 * This function binds tab switch events to the document object.
 */
export function bindTabEvents() {
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      State.lastTabExitTime = Date.now();
      new PageAnalyticsEvent('TAB_SWITCH', null, 'EXIT', null);
    } else {
      if (tabSwitchCausesReset()) {
        resetSession();
      } else {
        new PageAnalyticsEvent('TAB_SWITCH', null, 'RETURN', null);
      }
    }
  });
}
