/**
 * Callback function for binding scroll events to dom elements.
 * @param {Array} elements - Array of scroll event selectors
 */
fodoole.bindScrollEventsToElements = function (elements) {
  elements.forEach(function (element) {
    const elementLabel = element.label;
    const elementPath = element.value;
    const domElements = document.querySelectorAll(elementPath);

    for (let i = 0; i < domElements.length; i++) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            /* Only log the event if it hasn't been logged before, since it's
               possible for the website owner to select the same element multiple
               times for a single event.
            */
            if (!fodoole.state.scrollObservedElements.includes(elementLabel)) {
              const event = new fodoole.PageAnalyticsEvent('SCROLL', null, elementLabel, elementPath);
              event.pushEvent();
              fodoole.state.scrollObservedElements.push(elementLabel);
            }
            observer.unobserve(entry.target);
            observer = null;
          }
        });
      }, { threshold: 0.5 });
      observer.observe(domElements[i]);
    }
  });
};

/**
* Function for binding scroll events to dom elements. This function
* takes in an array of elements and binds an intersection observer to
* the event. The observer will fire when the element is 50% visible.
* @param {Array} boundElements - Array of elements to bind scroll events to
*/
fodoole.bindScrollEvents = function (boundElements) {
  // Use a mutation observer to bind events to new elements.
  fodoole.BodyMutationObserverManager.addCallback(function () { fodoole.bindScrollEventsToElements(boundElements); }, 'scroll');

  // Bind to existing elements.
  fodoole.bindScrollEventsToElements(boundElements);
};
