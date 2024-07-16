import { state } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { randInt } from './utils.js';

// FIXME: move somewhere else

/**
 * This function is called when the content is served to the user.
 */
export function contentServingCallback() {
  if (!state.contentServed) {
    if (!state.sessionId) {
      state.sessionId = String(randInt());
    }
    new PageAnalyticsEvent('CONTENT_SERVED', null, null, null);
    state.contentServed = true;
  }
}
