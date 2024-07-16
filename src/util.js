import { fodoole } from './fodoole.js';

/**
 * Function for generating a random 16-digit number.
 * @returns {number} - A random number between 10^15 and 10^16 - 1
 */
fodoole.randInt = function () {
  const min = 1;
  const max = Math.pow(10, 16) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export { fodoole };