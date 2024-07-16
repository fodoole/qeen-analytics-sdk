import { config, state } from './config.js';
import { bindClickEvents } from './clickEvents.js';
import { resetIdleTimer, bindIdleTimeEvents } from './idleEvents.js';
import { bindScrollEvents } from './scrollEvents.js';
import { bindTabEvents } from './tabEvents.js';

import { randInt } from './utils.js';

/**
 * @namespace fodoole
 * @description The main namespace for the Fodoole Analytics SDK.
 */
window.fodoole = window.fodoole || {};
// FIXME all this goes in init function
fodoole.config = config;
fodoole.state = state;

fodoole.bindClickEvents = bindClickEvents;
fodoole.resetIdleTimer = resetIdleTimer;
fodoole.bindIdleTimeEvents = bindIdleTimeEvents;
fodoole.bindScrollEvents = bindScrollEvents;
fodoole.bindTabEvents = bindTabEvents;

fodoole.randInt = randInt;

// export { fodoole };