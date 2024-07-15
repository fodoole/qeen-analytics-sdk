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