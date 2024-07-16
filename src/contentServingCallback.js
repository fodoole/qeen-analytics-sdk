import { fodoole } from './fodoole.js';

/**
 * This function is called when the content is served to the user.
 */
fodoole.contentServingCallback = function () {
  if (!fodoole.state.contentServed) {
    if (!fodoole.state.sessionId) {
      fodoole.state.sessionId = String(fodoole.randInt());
    }
    const event = new fodoole.PageAnalyticsEvent('CONTENT_SERVED', null, null, null);
    event.pushEvent();
    fodoole.state.contentServed = true;
  }
};

export { fodoole };
