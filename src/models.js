/**
 * Class that handles page-level analytics.
 * @class PageAnalyticsEvent
 * @param {string} type The type of event (e.g. CLICK, SCROLL, etc.)
 * @param {number} value The value of the event (numeric value, if applicable)
 * @param {string} label The label of the event (e.g. 'ADD_TO_CART')
 * @param {string} domPath The DOM path of the element that triggered the event
 */
export class PageAnalyticsEvent {
  constructor(type, value, label, domPath) {
    this.ts = Date.now();
    this.pid = fodoole.state.sessionId;
    this.t = type;
    this.v = value;
    this.l = label;
    this.edp = domPath;
    this.u = window.location.href;
    this.ua = navigator.userAgent;
    this.r = document.referrer;
    this.p = fodoole.config.projectId;
    this.csrvid = fodoole.config.contentServingId;
    this.cid = fodoole.config.contentId;
    this.uid = fodoole.state.fodooleDeviceId;

    this.endpoint = fodoole.config.analyticsEndpoint;
    // FIXME: this will be its own property
    this.npdp = !fodoole.config.enableContentGeneration;
  };

  // Pushes the event to the analytics endpoint.
  pushEvent() {
    if (!this.endpoint) {
      return;
    }
    if (window.location.hash.includes('fodoole-dev')) {
      console.log(this);
    }

    const payloadObject = {
      event: this
    };
    const payload = JSON.stringify(payloadObject);
    navigator.sendBeacon(this.endpoint, payload);
  };
}

export { PageAnalyticsEvent };
