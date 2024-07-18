/**
 * @file pageEvents.js
 * @description The page events script for Fodoole Analytics SDK.
 */

import { Config, State } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { InvalidParameterError } from './errors.js';
import { resetSession } from './sessionManager.js';
import { Debouncer } from './utils.js';

/**
 * Callback function for binding click events to DOM elements.
 * Accepts a single click event object or an array of click event objects.
 * @param {Object|Object[]} clickEvents - A click event object or an array of click event objects.
 * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set when sending the event.
 * @throws {InvalidParameterError} Throws an error if no elements are found with the provided selector.
 */
export function bindClickEvents(clickEvents) {
  if (Config.noFodoole) {
    return;
  }
  // Ensure clickEvents is always an array
  const eventsArray = Array.isArray(clickEvents) ? clickEvents : [clickEvents];
  eventsArray.forEach(function (event) {
    const domElements = document.querySelectorAll(event.value);
    if (domElements.length === 0) {
      throw new InvalidParameterError(`No elements found with the selector: ${event.value}`);
    }

    domElements.forEach(element => {
      // Only bind the event if it hasn't been bound before
      if (!element.hasAttribute('data-fodoole-click-bound')) {
        element.setAttribute('data-fodoole-click-bound', 'true');
        element.addEventListener('click', new Debouncer(function () {
          new PageAnalyticsEvent('CLICK', null, event.label, event.value);
        }, State.debounceTime).debounced);
      }
    });
    // Keep track of the click events
    Config.clickEvents = Config.clickEvents || new Set();
    Config.clickEvents.add(event);
  });
}

/**
 * Callback function for binding scroll events to DOM elements.
 * @param {Object|Object[]} scrollEvents - A scroll event object or an array of scroll event objects.
 * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set when sending the event.
 * @throws {InvalidParameterError} Throws an error if no elements are found with the provided selector.
 */
export function bindScrollEvents(scrollEvents) {
  if (Config.noFodoole) {
    return;
  }
  // Ensure scrollEvents is always an array
  const eventsArray = Array.isArray(scrollEvents) ? scrollEvents : [scrollEvents];
  eventsArray.forEach(function (event) {
    const label = event.label;
    const path = event.value;
    const domElements = document.querySelectorAll(path);
    if (domElements.length === 0) {
      throw new InvalidParameterError(`No elements found with the selector: ${path}`);
    }

    domElements.forEach(element => {
      let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Only log the event if it hasn't been logged before
            if (!State.scrollObservedElements.has(label)) {
              new PageAnalyticsEvent('SCROLL', null, label, path);
              State.scrollObservedElements.add(label);
            }
            observer.unobserve(entry.target);
            observer = null;
          }
        });
      }, { threshold: 0.5 });
      observer.observe(element);
    });
    // Keep track of the scroll events
    Config.scrollEvents = Config.scrollEvents || new Set();
    Config.scrollEvents.add(event);
  });
}

/**
 * This function checks if the tab switch causes a session reset.
 * @return {boolean} - True if the tab switch causes a session reset, false otherwise.
 */
function tabSwitchCausesReset() {
  const exitReturnDiff = Date.now() - State.lastTabExitTime;
  return exitReturnDiff >= Config.idleTime;
}

/**
 * This function binds tab switch events to the document object.
 */
export function bindTabEvents() {
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      State.lastTabExitTime = Date.now();
      new PageAnalyticsEvent('TAB_SWITCH', null, 'EXIT', null);
      // Flush any debounced events
      Debouncer.flushAll();
    } else {
      if (tabSwitchCausesReset()) {
        resetSession();
      } else {
        new PageAnalyticsEvent('TAB_SWITCH', null, 'RETURN', null);
      }
    }
  });
}

/**
 * This function instantiates and resets the idle timer when a user interacts with the page. 
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle.
 */
export function resetIdleTimer(idleThreshold) {
  clearTimeout(State.idleTimer);
  if (!document.hidden) {
    State.idleTimer = setTimeout(function () {
      /* sometimes the timer can be created while the page is in view, but fires
         after the page is hidden; this should ensure that tab switches don't
         trigger a session to reset twice
      */
      const idleTimeExceeded = Date.now() - State.lastIdleTime >= idleThreshold;
      if (!document.hidden && idleTimeExceeded) {
        new PageAnalyticsEvent('IDLE', idleThreshold, null, null);
        State.lastIdleTime = Date.now();
        // Reset the session
        resetSession();
      }
    }, idleThreshold);
  }
}

/**
 * This function binds idle time events to the document object.
 * @param {number} idleThreshold - the time in milliseconds before the user is considered idle.
 */
export function bindIdleTimeEvents(idleThreshold) {
  ['mousemove', 'keypress', 'touchmove', 'scroll', 'click', 'keyup', 'touchstart', 'touchend', 'visibilitychange']
    .forEach(function (event) { document.addEventListener(event, function () { resetIdleTimer(idleThreshold); }); });
}

/**
 * This function sends a checkout event to the analytics endpoint.
 * @param {string} currency - The currency of the transaction.
 * @param {number} value - The value of the transaction.
 * @throws {InvalidParameterError} Throws an error if the provided parameters are invalid.
 * @throws {InvalidParameterError} Throws an error if the event is attempted to be sent on a product detail page.
 * @throws {AnalyticsEndpointError} Throws an error if the analytics endpoint is not set.
 * @description Checkout events may only be sent on non-product detail pages.
 */
export function sendCheckoutEvent(currency, value) {
  if (Config.noFodoole) {
    return;
  }
  if (!currency || !value) {
    throw new InvalidParameterError('Currency and value are required for checkout events.');
  }
  if (Config.isPdp) {
    throw new InvalidParameterError('Checkout events may only be sent on non-product detail pages.');
  }
  new PageAnalyticsEvent('CHECKOUT', value, currency, null);
}
