import { fodoole } from './fodoole.js';

/**
 * Wrapper for the onload event
 * @param {function} f - function to be executed on load
 */
fodoole.onLoad = function (f) {
  if (document.body === null) {
    document.addEventListener('DOMContentLoaded', function () {
      f();
    }, false);
  } else {
    f();
  }
};

/**
 * Wrapper for beforeunload event
 * @param {function} f - function to be executed before the page is unloaded
 */
fodoole.beforeUnload = function (f) {
  window.addEventListener('beforeunload', function () {
    f();
  }, false);
};

export { fodoole };
