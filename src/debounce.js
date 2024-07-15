/**
 * Prevent too many firings of the same event e.g. clicks to avoid spam clicks
 * @param {function} fn - the function to be debounced
 * @param {number} delay - the time in milliseconds to wait before calling the function
 * @return {function} - a debouncer object with debounced, trigger, and clear functions
 */
fodoole.debounce = function (fn, delay) {
  let timer = null;
  let context, args;

  // clear function is used to clear the timeout
  let clear = function () {
    clearTimeout(timer);
    context = null;
    args = null;
    let index = fodoole.state.debouncedEvents.indexOf(debouncer);
    if (index !== -1) {
      fodoole.state.debouncedEvents.splice(index, 1);
    }
  };

  // debounced function is a holder for the timeout function and will exhibit
  // debounce behaviour
  let debounced = function () {
    context = this;
    args = arguments;
    let clearFunc = clear;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
      clearFunc();
    }, delay);
    let index = fodoole.state.debouncedEvents.indexOf(debouncer);
    if (index === -1) {
      fodoole.state.debouncedEvents.push(debouncer);
    }
  };

  // trigger function is used to invoke the function immediately
  let trigger = function () {
    if (context && args) {
      fn.apply(context, args);
    }
    clear();
  };

  /** After creating a debouncer object, start the timeout through the debounced function
      any extra calls to the debounced function within the delay time will reset the timer
      and the function will only be called after the delay time has passed without any calls
      The debouncer can be forced to trigger immediately by calling the trigger function
      The debouncer can be cleared by calling the clear function
      If the debouncer triggers naturally, forcefully, or is cleared, it cannot be triggered again through any means 
  **/
  let debouncer = { debounced, trigger, clear };

  return debouncer;
};

/**
  * Function that binds a given function to a delay. This is useful for
  * delaying sending analytics events immediately after they are fired.
  * @param {function} func - the function to be throttled
  * @param {number} wait - the time in milliseconds to wait before calling the function
  */
fodoole.throttle = function (func, wait) {
  const interv = function (w) {
    return function () {
      setTimeout(interv, w);
      try {
        func.call(null);
      } catch (e) {
        throw e.toString();
      }
    };
  }(wait);

  setTimeout(interv, wait);
};
