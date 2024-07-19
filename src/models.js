/**
 * @file models.js
 * @description The models for Fodoole Analytics SDK.
 */

import { Config, State } from './config.js';
import { AnalyticsEndpointError, InvalidParameterError } from './errors.js';

/**
 * Class that handles page-level analytics.
 * @class PageAnalyticsEvent
 * @param {string} type The type of event (e.g. CLICK, SCROLL, etc.).
 * @param {number} value The value of the event (numeric value, if applicable).
 * @param {string} label The label of the event (e.g. 'ADD_TO_CART').
 * @param {string} domPath The DOM path of the element that triggered the event.
 * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set.
 * @throws {InvalidParameterError} Throws an error if the user device ID is not set.
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
  }

  /**
   * Push the event to the analytics endpoint.
   * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set.
   */
  pushEvent() {
    if (!Config.analyticsEndpoint) {
      throw new AnalyticsEndpointError('Fodoole analytics endpoint not set.');
    }
    if (!State.fodooleDeviceId) {
      throw new InvalidParameterError('Fodoole user device ID is required.');
    }
    if (window.location.hash.includes('fodoole-dev')) {
      console.log(this);
    }

    const payloadObject = {
      event: this
    };
    const payload = JSON.stringify(payloadObject);
    navigator.sendBeacon(Config.analyticsEndpoint, payload);
  }
}

/**
 * Class that handles the parameters for fetching content.
 * @class fetchContentParams
 * @extends URLSearchParams
 * @param {string} fodooleDeviceId - The Fodoole user device ID.
 */
export class fetchContentParams extends URLSearchParams {
  constructor(fodooleDeviceId) {
    super({
      pageUrl: window.location.href,
      userDeviceId: fodooleDeviceId,
      referrerUrl: document.referrer,
      locale: navigator.language,
      langCode: document.documentElement.lang || 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }
}

/**
 * Structure for interaction events (i.e. clicks, scrolls).
 * @class InteractionEvent
 * @param {string} label - The label of the event.
 * @param {number} value - The selector to bind the event to.
 * @throws {InvalidParameterError} Throws an error if the provided parameters are invalid.
 */
export class InteractionEvent {
  constructor(label, value) {
    if (!label || !value) {
      throw new InvalidParameterError('Label and value are required for interaction events.');
    }
    this.label = label;
    this.value = value;
  }
}
