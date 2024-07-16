import { PageAnalyticsEvent } from './models.js';
import { BodyMutationObserverManager, Debouncer } from './utils.js';

/**
 * Callback function for binding click events to dom elements.
 * @param {Array} clickEvents - Array of click event objects
 */
function bindClickEventsToElements(clickEvents) {
  clickEvents.forEach(function (event) {
    const label = event.label;
    const path = event.value;
    const domElements = document.querySelectorAll(path);

    domElements.forEach(element => {
      // Only bind the event if it hasn't been bound before
      if (!element.hasAttribute('data-fodoole-click-bound')) {
        element.setAttribute('data-fodoole-click-bound', 'true');
        element.addEventListener('click', Debouncer(function () {
          const event = new PageAnalyticsEvent('CLICK', null, label, path);
          event.pushEvent();
        }, fodoole.state.debounceTime).debounced);
      }
    });
  });
}

/**
 * Function for binding click events to dom elements. 
 * @param {Array} clickEvents - Array of click event objects
 */
export function bindClickEvents(clickEvents) {
  // Use a mutation observer to bind events to new elements.
  BodyMutationObserverManager.addCallback(function () { bindClickEventsToElements(clickEvents); }, 'click');

  // Bind to existing elements.
  bindClickEventsToElements(clickEvents);
}

export { bindClickEvents };
