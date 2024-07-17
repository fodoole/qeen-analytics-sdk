/**
 * @file models.js
 * @description The models for Fodoole Analytics SDK.
 */

import { Config, State } from './config.js';

/**
 * Class that handles page-level analytics.
 * @class PageAnalyticsEvent
 * @param {string} type The type of event (e.g. CLICK, SCROLL, etc.).
 * @param {number} value The value of the event (numeric value, if applicable).
 * @param {string} label The label of the event (e.g. 'ADD_TO_CART').
 * @param {string} domPath The DOM path of the element that triggered the event.
 */
export class PageAnalyticsEvent {
  ts = Date.now();
  pid = State.sessionId;
  u = window.location.href;
  ua = navigator.userAgent;
  r = document.referrer;
  p = Config.projectId;
  csrvid = Config.contentServingId;
  cid = Config.contentId;
  uid = State.fodooleDeviceId;
  npdp = !Config.isPdp;

  constructor(type, value, label, domPath) {
    this.t = type;
    this.v = value;
    this.l = label;
    this.edp = domPath;

    this.pushEvent();
  };

  // Pushes the event to the analytics endpoint.
  pushEvent() {
    if (!Config.analyticsEndpoint) {
      return;
    }
    if (window.location.hash.includes('fodoole-dev')) {
      console.log(this);
    }

    const payloadObject = {
      event: this
    };
    const payload = JSON.stringify(payloadObject);
    navigator.sendBeacon(Config.analyticsEndpoint, payload);
  };
}

/**
 * Class that handles the parameters for fetching content.
 * @class fetchContentParams
 * @extends URLSearchParams
 * @param {string} userDeviceId - The user device ID.
 */
export class fetchContentParams extends URLSearchParams {
  constructor(userDeviceId) {
    super({
      pageUrl: window.location.href,
      userDeviceId: userDeviceId,
      referrerUrl: document.referrer,
      locale: navigator.language,
      langCode: document.documentElement.lang || 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }
}
