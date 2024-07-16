import { state } from './config.js';
import { PageAnalyticsEvent } from './models.js';
import { BodyMutationObserverManager } from './utils.js';

/**
 * Callback function for binding scroll events to dom elements.
 * @param {Array} scrollEvents - Array of scroll event selectors
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
            if (!state.scrollObservedElements.includes(label)) {
              new PageAnalyticsEvent('SCROLL', null, label, path);
              state.scrollObservedElements.push(label);
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
* Function for binding scroll events to dom elements. This function
* takes in an array of elements and binds an intersection observer to
* the event. The observer will fire when the element is 50% visible.
* @param {Array} boundElements - Array of elements to bind scroll events to
*/
export function bindScrollEvents(boundElements) {
  // Use a mutation observer to bind events to new elements.
  BodyMutationObserverManager.addCallback(function () { bindScrollEventsToElements(boundElements); }, 'scroll');

  // Bind to existing elements.
  bindScrollEventsToElements(boundElements);
}
