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
  public ts: number = Date.now();
  public pid: string = State.sessionId;
  public u: string = window.location.href;
  public ua: string = navigator.userAgent;
  public r: string = document.referrer;
  public p: string = Config.projectId;
  public csrvid: string = Config.contentServingId;
  public cid: string = Config.contentId;
  public uid: string = State.fodooleDeviceId;
  public npdp: boolean = !Config.isPdp;

  public t: string;
  public v: number | null;
  public l: string | null;
  public edp: string | null;

  constructor(type: string, value: number | null, label: string | null, domPath: string | null) {
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
  pushEvent(): void {
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
  constructor(fodooleDeviceId: string) {
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
 * @interface ContentResponse
 * @property {string} fodooleDeviceId - The Fodoole device ID.
 * @property {string} analyticsEndpoint - The endpoint for the analytics server.
 * @property {string} projectId - The project ID.
 * @property {string} contentServingId - The content serving ID.
 * @property {string} contentId - The content ID.
 * @property {boolean} isPdp - The product detail page flag.
 * @property {number} idleTime - The idle time in milliseconds.
 * @property {any[]} rawContentSelectors - The raw content selectors.
 * @property {Object} contentSelectors - The content selectors and content.
 */
export interface ContentResponse {
  fodooleDeviceId: string;
  analyticsEndpoint: string;
  projectId: string;
  idleTime: number;
  contentServingId: string;
  contentId: string;
  isPdp: boolean;
  rawContentSelectors: any[];
  contentSelectors: Object;
}

/**
 * Structure for interaction events (i.e. clicks, scrolls).
 * @class InteractionEvent
 * @param {string} label - The label of the event.
 * @param {string} value - The selector to bind the event to.
 * @throws {InvalidParameterError} Throws an error if the provided parameters are invalid.
 */
export class InteractionEvent {
  public label: string;
  public value: string;

  constructor(label: string, value: string) {
    if (!label || !value) {
      throw new InvalidParameterError('Label and value are required for interaction events.');
    }
    this.label = label;
    this.value = value;
  }
}
