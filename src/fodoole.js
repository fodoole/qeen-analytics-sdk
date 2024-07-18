/**
 * @file Fodoole Analytics SDK
 * @description The main script for Fodoole Analytics SDK.
 */

import { fetchContent, initPageSession } from './sessionManager.js';
import { Config, State } from './config.js';
import { bindClickEvents, bindScrollEvents, sendCheckoutEvent } from './pageEvents.js';
import { randInt } from './utils.js';
import './demoMode.js';
import './errors.js';

/**
 * @namespace fodoole
 * @description The main namespace for the Fodoole Analytics SDK.
 */
window.fodoole = window.fodoole || {};

fodoole.randInt = randInt;

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
fodoole.NoFodooleError = NoFodooleError;

if (window.location.hash.includes('no-fodoole')) {
  Config.noFodoole = true;
  console.log(`${window.fodooleError = 'Fodoole is disabled; URL contains #no-fodoole'}`);
  fodoole.receiveMessage = receiveMessage;
  window.addEventListener('message', fodoole.receiveMessage, false);
}

// export { fodoole };