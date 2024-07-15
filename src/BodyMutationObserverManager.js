/**
 * Class for managing a single instance of a mutation observer for the body element.
 * @class BodyMutationObserverManager
 */
fodoole.BodyMutationObserverManager = class {
  static observer = null;
  static callbackQueue = [];

  // Initialise the mutation observer by creating a new instance and observing the body element
  static init() {
    if (!fodoole.BodyMutationObserverManager.observer) {
      fodoole.BodyMutationObserverManager.observer = new MutationObserver(fodoole.BodyMutationObserverManager.handleMutations);
      document.addEventListener('DOMContentLoaded', function () {
        fodoole.BodyMutationObserverManager.observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  // Handle mutations by calling each callback in the callback queue
  static handleMutations(_) {
    _.forEach(__ => {
      fodoole.BodyMutationObserverManager.callbackQueue.forEach(item => {
        item.callback();
      });
    });
  }

  // Add a callback to the callback queue
  static addCallback(callback, id = null) {
    // Only add the callback if it is a function and has not been added before
    let exists = fodoole.BodyMutationObserverManager.callbackQueue.some(item => item.id === id);
    if (typeof callback === 'function' && id !== null && !exists) {
      fodoole.BodyMutationObserverManager.callbackQueue.push({ callback: callback, id: id });
    }
  }

  // Remove a callback from the callback queue
  static removeCallback(id) {
    fodoole.BodyMutationObserverManager.callbackQueue = fodoole.BodyMutationObserverManager.callbackQueue.filter(item => item.id !== id);
  }
};
