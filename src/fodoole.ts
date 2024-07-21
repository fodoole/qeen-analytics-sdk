/**
 * @file Fodoole Analytics SDK
 * @description The main script for Fodoole Analytics SDK.
 */

import { fetchContent, initPageSession } from './sessionManager.js';
import { Config, State } from './config.js';
import { bindClickEvents, bindScrollEvents, sendCheckoutEvent } from './pageEvents.js';
import { randInt } from './utils.js';
import { InteractionEvent } from './models.js';
import { receiveMessage } from './demoMode.js';
import { InvalidParameterError, AnalyticsEndpointError, ResponseNotOkError, URLContainsNoFodooleError } from './errors.js';

declare global {
  interface Window {
    fodoole: any;
    fodooleError: string;
  }
}

/**
 * @namespace fodoole
 * @description The main namespace for the Fodoole Analytics SDK.
 */
window.fodoole = window.fodoole || {};

window.fodoole.fetchFodooleContent = fetchContent;
window.fodoole.initPageSession = initPageSession;
window.fodoole.bindClickEvents = bindClickEvents;
window.fodoole.bindScrollEvents = bindScrollEvents;
window.fodoole.sendCheckoutEvent = sendCheckoutEvent;
window.fodoole.randInt = randInt;
window.fodoole.config = Config;
window.fodoole.state = State;
window.fodoole.InteractionEvent = InteractionEvent;
window.fodoole.InvalidParameterError = InvalidParameterError;
window.fodoole.AnalyticsEndpointError = AnalyticsEndpointError;
window.fodoole.ResponseNotOkError = ResponseNotOkError;
window.fodoole.URLContainsNoFodooleError = URLContainsNoFodooleError;

if (window.location.hash.includes('no-fodoole')) {
  Config.noFodoole = true;
  console.log(`${window.fodooleError = 'Fodoole is disabled; URL contains #no-fodoole'}`);
  window.fodoole.receiveMessage = receiveMessage;
  window.addEventListener('message', window.fodoole.receiveMessage, false);
} else {
  Config.noFodoole = false;
}
