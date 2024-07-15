/**
 * Prepare selectors for the content rendering or replacement.
 */
fodoole.prepareSelectors = function () {
  if (fodoole.config.rawContentSelectors.length > 0) {
    const rawContentSelectors = fodoole.config.rawContentSelectors;
    for (let i = 0; i < rawContentSelectors.length; i++) {
      if (rawContentSelectors[i].path === 'html > head > title' || rawContentSelectors[i].path === 'head > title') {
        // Special case for title to stay consistent
        fodoole.config.titleContent = rawContentSelectors[i].value;
      } else {
        fodoole.config.contentSelectors[rawContentSelectors[i].path] = rawContentSelectors[i].value;
      }
    }
  }
};