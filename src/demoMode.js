/**
 * @file demoMode.js
 * @description The demo mode script for Fodoole Analytics SDK.
 * @description This script is used when running in demo mode via iframe.
 */

/**.
 * Function for applying content replacement.
 * @param {string} domPath - The DOM path of the target element.
 * @param {string} content - Content to be replaced.
 * @description Used when running in demo mode via iframe.
 */
function renderDemoContent(domPath, content) {
  const element = document.querySelector(domPath);
  element.innerHTML = content;
}

/**
 * Function for scrolling to a target element.
 * @param {string} domPath - The DOM path of the target element.
 * @param {int} offset - The offset value.
 * @description Used when running in demo mode via iframe.
 */
function scrollToTarget(domPath, offset) {
  window.scrollTo({
    behavior: 'smooth',
    top:
      document.querySelector(domPath).getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      offset,
  });
}

/**
 * Function for receiving messages from the parent window.
 * @param {Object} event - The event object.
 * @description Used when running in demo mode via iframe.
 */
const receiveMessage = (event) => {
  if (event) {
    if (event.data.action === 'renderDemoContent') {
      renderDemoContent(event.data.domPath, event.data.content);
    } else if (event.data.action === 'scrollToTarget') {
      scrollToTarget(event.data.domPath, 100);
    }
  }
};
export { receiveMessage };
