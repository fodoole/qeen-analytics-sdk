/**
 * @file clickEvents.js
 * @description The click events script for Fodoole Analytics SDK.
 */

import { State } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { BodyMutationObserverManager, Debouncer } from './utils.js';

/**
 * Callback function for binding click events to dom elements.
 * @param {Array} clickEvents - Array of click event objects.
 */
function bindClickEventsToElements(clickEvents) {
  clickEvents.forEach(function (event) {
    const domElements = document.querySelectorAll(event.value);
    domElements.forEach(element => {
      // Only bind the event if it hasn't been bound before
      if (!element.hasAttribute('data-fodoole-click-bound')) {
        element.setAttribute('data-fodoole-click-bound', 'true');
        element.addEventListener('click', new Debouncer(function () {
          new PageAnalyticsEvent('CLICK', null, event.label, event.value);
        }, State.debounceTime).debounced);
      }
    });
  });
}

/**
 * Function for binding click events to dom elements. 
 * @param {Array} clickEvents - Array of click event objects.
 */
export function bindClickEvents(clickEvents) {
  // Use a mutation observer to bind events to new elements.
  BodyMutationObserverManager.addCallback(function () { bindClickEventsToElements(clickEvents); }, 'click');

  // Bind to existing elements.
  bindClickEventsToElements(clickEvents);
}
