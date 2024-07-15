/**
 * Wrapper for beforeunload event
 * @param {function} f - function to be executed before the page is unloaded
 */
fodoole.beforeUnload = function (f) {
  window.addEventListener('beforeunload', function () {
    f();
  }, false);
};
