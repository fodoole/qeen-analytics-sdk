/**
   * Callback function for binding click events to dom elements.
   * @param {Array} elements - Array of click event objects
   */
fodoole.bindClickEventsToElements = function (elements) {
  elements.forEach(function (element) {
    const elementLabel = element.label;
    const elementPath = element.value;
    const domElements = document.querySelectorAll(elementPath);

    for (let i = 0; i < domElements.length; i++) {
      // Only bind the event if it hasn't been bound before
      if (!domElements[i].hasAttribute('data-fodoole-click-bound')) {
        domElements[i].setAttribute('data-fodoole-click-bound', 'true');
        domElements[i].addEventListener('click', fodoole.debounce(function () {
          const event = new fodoole.PageAnalyticsEvent('CLICK', null, elementLabel, elementPath);
          event.pushEvent();
        }, fodoole.state.debounceTime).debounced);
      }
    }
  });
};

/**
 * Function for binding click events to dom elements. 
 * @param {Array} boundElements - Array of click event objects
 */
fodoole.bindClickEvents = function (boundElements) {
  // Use a mutation observer to bind events to new elements.
  fodoole.BodyMutationObserverManager.addCallback(function () { fodoole.bindClickEventsToElements(boundElements); }, 'click');

  // Bind to existing elements.
  fodoole.bindClickEventsToElements(boundElements);
};
