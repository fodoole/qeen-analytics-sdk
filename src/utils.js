/**
 * Wrapper for the onload event
 * @param {function} f - function to be executed on load
 */
export function onLoad(f) {
  if (document.body === null) {
    document.addEventListener('DOMContentLoaded', function () {
      f();
    }, false);
  } else {
    f();
  }
}

/**
 * Wrapper for beforeunload event
 * @param {function} f - function to be executed before the page is unloaded
 */
export function beforeUnload(f) {
  window.addEventListener('beforeunload', function () {
    f();
  }, false);
}

/**
 * Prepare selectors for the content rendering or replacement.
 */
export function prepareSelectors() {
  if (fodoole.config.rawContentSelectors.length > 0) {
    const rawContentSelectors = fodoole.config.rawContentSelectors;
    for (let i = 0; i < rawContentSelectors.length; i++) {
      if (rawContentSelectors[i].path === 'html > head > title' || rawContentSelectors[i].path === 'head > title') {
        // Special case for title to stay consistent
        // FIXME
        fodoole.config.titleContent = rawContentSelectors[i].value;
      } else {
        fodoole.config.contentSelectors[rawContentSelectors[i].path] = rawContentSelectors[i].value;
      }
    }
  }
}

/**
 * Class for managing a single instance of a mutation observer for the body element.
 * @class BodyMutationObserverManager
 */
export class BodyMutationObserverManager {
  static observer = null;
  static callbackQueue = [];

  // Initialise the mutation observer by creating a new instance and observing the body element
  static init() {
    if (!BodyMutationObserverManager.observer) {
      BodyMutationObserverManager.observer = new MutationObserver(BodyMutationObserverManager.handleMutations);
      document.addEventListener('DOMContentLoaded', function () {
        BodyMutationObserverManager.observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  // Handle mutations by calling each callback in the callback queue
  static handleMutations(_) {
    _.forEach(__ => {
      BodyMutationObserverManager.callbackQueue.forEach(item => {
        item.callback();
      });
    });
  }

  // Add a callback to the callback queue
  static addCallback(callback, id = null) {
    // Only add the callback if it is a function and has not been added before
    let exists = BodyMutationObserverManager.callbackQueue.some(item => item.id === id);
    if (typeof callback === 'function' && id !== null && !exists) {
      BodyMutationObserverManager.callbackQueue.push({ callback: callback, id: id });
    }
  }

  // Remove a callback from the callback queue
  static removeCallback(id) {
    BodyMutationObserverManager.callbackQueue = BodyMutationObserverManager.callbackQueue.filter(item => item.id !== id);
  }
}

/**
 * @class Debouncer
 * @param {function} fn - the function to be debounced
 * @param {number} delay - the time in milliseconds to wait before calling the function
 * @returns {object} - an object containing the debounced function, a trigger function, and a clear function
 * @property {function} clear - the function to clear the timeout
 * @property {function} debounced - the function to debounce the function
 * @property {function} trigger - the function to trigger the function immediately
 * @description After creating a debouncer object, start the timeout through the debounced function any extra calls to the debounced function within the delay time will reset the timer and the function will only be called after the delay time has passed without any calls The debouncer can be forced to trigger immediately by calling the trigger function The debouncer can be cleared by calling the clear function If the debouncer triggers naturally, forcefully, or is cleared, it cannot be triggered again through any means.
 */
export class Debouncer {
  constructor(fn, delay) {
    this.fn = fn;
    this.delay = delay;
    this.timer = null;
    this.context = null;
    this.args = null;
  }

  // Clear function is used to clear the timeout
  clear = () => {
    clearTimeout(this.timer);
    this.context = null;
    this.args = null;
    let index = fodoole.state.debouncedEvents.indexOf(this);
    if (index !== -1) {
      fodoole.state.debouncedEvents.splice(index, 1);
    }
  };

  // Debounced function is a holder for the timeout function and will exhibit debounce behaviour
  debounced = () => {
    this.context = this;
    this.args = arguments;
    let clearFunc = this.clear;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fn.apply(this.context, this.args);
      clearFunc();
    }, this.delay);
    let index = fodoole.state.debouncedEvents.indexOf(this);
    if (index === -1) {
      fodoole.state.debouncedEvents.push(this);
    }
  };

  // Trigger function is used to invoke the function immediately
  trigger = () => {
    if (this.context && this.args) {
      this.fn.apply(this.context, this.args);
    }
    this.clear();
  };
}

/**
 * Function for generating a random 16-digit number.
 * @returns {number} - A random number between 10^15 and 10^16 - 1
 */
export function randInt() {
  const min = 1;
  const max = Math.pow(10, 16) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { onLoad, beforeUnload, BodyMutationObserverManager, randInt, prepareSelectors, Debouncer };
