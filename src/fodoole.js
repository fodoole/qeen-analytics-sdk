/**
 * @file Fodoole Analytics SDK
 * @description The main script for Fodoole Analytics SDK.
 */

import { fetchContent, initFodooleAnalytics } from './sessionManager.js';
import { Config, State } from './config.js';
import { bindClickEvents } from './clickEvents.js';
import { bindScrollEvents } from './scrollEvents.js';
import { randInt } from './utils.js';
import { receiveMessage } from './demoMode.js';

/**
 * @namespace fodoole
 * @description The main namespace for the Fodoole Analytics SDK.
 */
window.fodoole = window.fodoole || {};

if (window.location.href.includes('#no-fodoole')) {
  console.log(`${window.fodooleError = 'Fodoole is disabled; URL contains #no-fodoole'}`);
  fodoole.receiveMessage = receiveMessage;
  window.addEventListener('message', fodoole.receiveMessage, false);
} else {
  fodoole.fetchFodooleContent = fetchContent;
  fodoole.initFodooleAnalytics = initFodooleAnalytics;
  fodoole.config = Config;
  fodoole.state = State;
  fodoole.bindClickEvents = bindClickEvents; // FIXME: maybe unnecessary
  fodoole.bindScrollEvents = bindScrollEvents; // FIXME: maybe unnecessary
  fodoole.randInt = randInt;
}

// export { fodoole };