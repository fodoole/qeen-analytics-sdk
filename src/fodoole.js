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
fodoole.InteractionEvent = InteractionEvent;
fodoole.InvalidParameterError = InvalidParameterError;
fodoole.AnalyticsEndpointError = AnalyticsEndpointError;
fodoole.ResponseNotOkError = ResponseNotOkError;
fodoole.URLContainsNoFodooleError = URLContainsNoFodooleError;

if (window.location.hash.includes('no-fodoole')) {
  Config.noFodoole = true;
  console.log(`${window.fodooleError = 'Fodoole is disabled; URL contains #no-fodoole'}`);
  fodoole.receiveMessage = receiveMessage;
  window.addEventListener('message', fodoole.receiveMessage, false);
}

// export { fodoole }; // FIXME
