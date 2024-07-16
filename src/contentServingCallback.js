import { PageAnalyticsEvent } from './models.js';
import { randInt } from './utils.js';

// FIXME: move somewhere else

/**
 * This function is called when the content is served to the user.
 */
export function contentServingCallback() {
  if (!fodoole.state.contentServed) {
    if (!fodoole.state.sessionId) {
      fodoole.state.sessionId = String(randInt());
    }
    const event = new PageAnalyticsEvent('CONTENT_SERVED', null, null, null);
    event.pushEvent();
    fodoole.state.contentServed = true;
  }
}

export { contentServingCallback };
