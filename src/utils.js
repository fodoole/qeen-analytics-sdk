/**
 * @file utils.js
 * @description Utility functions for Fodoole Analytics SDK.
 */

/**
 * Wrapper for the onload event.
 * @param {function} fn - function to be executed on load.
 */
export function onLoad(fn) {
  if (document.body === null) {
    document.addEventListener('DOMContentLoaded', function () {
      fn();
    }, false);
  } else {
    fn();
  }
}

/**
 * Wrapper for beforeunload event.
 * @param {function} fn - function to be executed before the page is unloaded.
 */
export function beforeUnload(fn) {
  window.addEventListener('beforeunload', function () {
    fn();
  }, false);
}

/**
 * @class Debouncer
 * @param {function} fn - the function to be debounced.
 * @param {number} delay - the time in milliseconds to wait before calling the function.
 * @returns {Debouncer} - an object containing the debounced function, a trigger function, and a clear function.
 * @property {function} debounced - the function to debounce the function.
 * @property {function} trigger - the function to trigger the function immediately.
 * @property {function} clear - the function to clear the timeout.
 * @property @static {function} flushAll - the function to flush all pending debounced events.
 * @description After creating a debouncer object, start the timeout through the debounced function. Any extra calls to the debounced function within the delay time will reset the timer and the function will only be called after the delay time has passed without any calls. The debouncer can be forced to trigger immediately by calling the trigger function. The debouncer can be cleared by calling the clear function.
 */
export class Debouncer {
  static debouncedEvents = [];
  timer = null;
  context = null;
  args = null;

  constructor(fn, delay) {
    this.fn = fn;
    this.delay = delay;
  }

  /**
   * Clear the timeout.
   */
  clear = () => {
    clearTimeout(this.timer);
    this.context = null;
    this.args = null;
    let index = Debouncer.debouncedEvents.indexOf(this);
    if (index !== -1) {
      Debouncer.debouncedEvents.splice(index, 1);
    }
  }

  /**
   * Debounce the function.
   * @param {...any} args - arguments to be passed to the function.
   */
  debounced = (...args) => {
    this.context = this;
    this.args = args;
    let clearFunc = this.clear;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fn.apply(this.context, this.args);
      clearFunc();
    }, this.delay);
    let index = Debouncer.debouncedEvents.indexOf(this);
    if (index === -1) {
      Debouncer.debouncedEvents.push(this);
    }
  }

  /**
   * Trigger the function immediately.
   */
  trigger = () => {
    if (this.context && this.args) {
      this.fn.apply(this.context, this.args);
    }
    this.clear();
  }

  /**
   * Flush all pending debounced events.
   */
  static flushAll = () => {
    Debouncer.debouncedEvents.forEach(debouncer => {
      debouncer.trigger();
    });
  }
}

/**
 * Function for generating a random 16-digit number.
 * @returns {number} - A random number between `10^15` and `10^16 - 1`.
 */
export function randInt() {
  const min = 1;
  const max = Math.pow(10, 16) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Function for limiting a value between a minimum and maximum value.
 * @param {number} value - The value to be limited.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @param {number} defaultValue - The default value.
 * @returns {number} - The limited value.
 */
export function limit(value, min, max, defaultValue = 0) {
  return Math.min(Math.max(value, min), max) || defaultValue;
}
