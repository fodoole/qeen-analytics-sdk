/**
 * @file scrollEvents.js
 * @description The scroll events script for Fodoole Analytics SDK.
 */

import { State } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { BodyMutationObserverManager } from './utils.js';

/**
 * Callback function for binding scroll events to dom elements.
 * @param {object[]} scrollEvents - Array of scroll event selectors.
 */
function bindScrollEventsToElements(scrollEvents) {
  scrollEvents.forEach(function (event) {
    const label = event.label;
    const path = event.value;
    const domElements = document.querySelectorAll(path);

    domElements.forEach(element => {
      let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            /* Only log the event if it hasn't been logged before, since it's
               possible for the website owner to select the same element multiple
               times for a single event.
            */
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
  });
}

/**
* Function for binding scroll events to dom elements.
* @description The observer will fire when the element is 50% visible.
* @param {object[]} scrollEvents - Array of elements to bind scroll events to.
*/
export function bindScrollEvents(scrollEvents) {
  // Use a mutation observer to bind events to new elements.
  BodyMutationObserverManager.addCallback(function () { bindScrollEventsToElements(scrollEvents); }, 'scroll');

  // Bind to existing elements.
  bindScrollEventsToElements(scrollEvents);
}
