/**
 * @file config.ts
 * @description The configuration objects for Fodoole Analytics SDK.
 */

import { InteractionEvent } from "./models";
import { BindQueueItem } from "./sessionManager";

/**
 * @constant {string} getContentEndpoint - The endpoint to fetch content.
 */
export const getContentEndpoint: string = ''; // FIXME: add the endpoint

/**
 * @class Config
 * @description The configuration class for Fodoole Analytics SDK.
 * @property {string} analyticsEndpoint - The endpoint for the analytics server.
 * @property {string} projectId - The project ID.
 * @property {string} contentServingId - The content serving ID.
 * @property {string} contentId - The content ID.
 * @property {boolean} isPdp - The product detail page flag.
 * @property {number} idleTime - The idle time in milliseconds.
 * @property {InteractionEvent[]} clickEvents - The click events array.
 * @property {InteractionEvent[]} scrollEvents - The scroll events array.
 * @property {boolean} noFodoole - If the URL contains #no-fodoole.
 * @property {any[]} rawContentSelectors - The raw content selectors.
 * @property {Object} contentSelectors - The content selectors and content.
 */
export class Config {
  public static analyticsEndpoint: string;
  public static projectId: string;
  public static contentServingId: string;
  public static contentId: string;
  public static isPdp: boolean;
  public static idleTime: number;
  public static clickEvents: InteractionEvent[];
  public static scrollEvents: InteractionEvent[];
  public static noFodoole: boolean;
  public static rawContentSelectors: any[];
  public static contentSelectors: Object;
}

/**
 * @class State
 * @description The state class for Fodoole Analytics SDK.
 * @property {number} debounceTime - The debounce time in milliseconds.
 * @property {string} fodooleDeviceId - The Fodoole device ID.
 * @property {boolean} boundThreadEvents - The bound thread events flag.
 * @property {BindQueueItem[]} bindQueue - The bind queue.
 * @property {boolean} contentServed - The content served flag.
 * @property {string} sessionId - The session ID.
 * @property {boolean} isResetSession - The reset session flag.
 * @property {number} idleTimer - The idle timer.
 * @property {number} lastIdleTime - The last idle time.
 * @property {number} lastTabExitTime - The last tab exit time.
 * @property {Set<InteractionEvent | any>} scrollObservedElements - The set of scroll observed elements.
 */
export class State {
  public static readonly debounceTime: number = 500;

  public static fodooleDeviceId: string = '';
  public static boundThreadEvents: boolean = false;
  public static bindQueue: BindQueueItem[] = [];

  public static contentServed: boolean;
  public static sessionId: string;
  public static isResetSession: boolean;
  public static idleTimer: number;
  public static lastIdleTime: number;
  public static lastTabExitTime: number;
  public static scrollObservedElements: Set<InteractionEvent | any>;

  /**
   * Function to reset the state.
   */
  static reset(): void {
    State.contentServed = false;
    State.sessionId = '';
    State.isResetSession = false;
    State.idleTimer = 0;
    State.lastIdleTime = Date.now();
    State.lastTabExitTime = 0;
    State.scrollObservedElements = new Set();
  }
}