/**
 * @file Fodoole Analytics SDK
 * @description The main script for Fodoole Analytics SDK.
 */

import { fetchContent, initPageSession } from './sessionManager.js';
import { Config, State } from './config.js';
import { bindClickEvents, bindScrollEvents, sendCheckoutEvent } from './pageEvents.js';
import { randInt } from './utils.js';
import { receiveMessage } from './demoMode.js';
import { InvalidParameterError, AnalyticsEndpointError, NoFodooleError, ResponseNotOkError } from './errors.js';

/**
 * @namespace fodoole
 * @description The main namespace for the Fodoole Analytics SDK.
 */
window.fodoole = window.fodoole || {};

fodoole.randInt = randInt;

if (window.location.hash.includes('no-fodoole')) {
  console.log(`${window.fodooleError = 'Fodoole is disabled; URL contains #no-fodoole'}`);
  fodoole.receiveMessage = receiveMessage;
  fodoole.NoFodooleError = NoFodooleError;
  window.addEventListener('message', fodoole.receiveMessage, false);
} else {
  fodoole.fetchFodooleContent = fetchContent;
  fodoole.initPageSession = initPageSession;
  fodoole.bindClickEvents = bindClickEvents;
  fodoole.bindScrollEvents = bindScrollEvents;
  fodoole.sendCheckoutEvent = sendCheckoutEvent;
  fodoole.config = Config;
  fodoole.state = State;
  fodoole.InvalidParameterError = InvalidParameterError;
  fodoole.AnalyticsEndpointError = AnalyticsEndpointError;
  fodoole.ResponseNotOkError = ResponseNotOkError;
}

// export { fodoole };