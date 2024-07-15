; (function () {
  fodoole.BodyMutationObserverManager.init();
  window.initFodooleConfig();
  /**
    * Function that implements common logic for resetting the session state.
    * This function is called when a session is initialised or reset.
    * @param {string} label The label for the page view event.
    */
  fodoole.initResetCommon = function (label) {
    // Manage state
    if (label === 'RESET') {
      fodoole.state.isResetSession = true;
    }
    // Set the session id
    if (!fodoole.state.sessionId) {
      fodoole.state.sessionId = String(fodoole.randInt());
    }

    // Render content
    if (fodoole.config.contentSelectors && fodoole.config.enableContentGeneration) {
      fodoole.renderContent(fodoole.config.contentSelectors, fodoole.contentServingCallback);
      fodoole.renderTitle();
    }
    if (fodoole.state.recommendationSelectors) {
      fodoole.renderContent(fodoole.state.recommendationSelectors, fodoole.secondaryContentServingCallback);
    }

    // Instantiate idle timer
    fodoole.resetIdleTimer(fodoole.config.idleTime);

    // Bind scroll events
    fodoole.bindScrollEvents(fodoole.config.scrollEvents);

    // Log the page view event
    const logEvent = new fodoole.PageAnalyticsEvent('PAGE_VIEW', null, label, null);

    // Log FODOOLE_ORIGINAL_SERVED to GA4 if original content has been served
    if (fodoole.state.shouldPushEventsToGA4 && !fodoole.state.contentServed) {
      gtag('event', 'FODOOLE_ORIGINAL_SERVED', {
        content_id: fodoole.config.contentId,
      });
    }

    // Only send the page view event if the page is visible
    if (document.visibilityState === 'visible') {
      logEvent.pushEvent();
    } else { // If the page is not visible, wait for it to become visible
      document.addEventListener('visibilitychange', function logVisibleEvent() {
        fodoole.state.lastTabExitTime = Date.now();
        if (document.visibilityState === 'visible') {
          logEvent.pushEvent();
          document.removeEventListener('visibilitychange', logVisibleEvent);
        }
      });
    }
  };

  fodoole.initSession = function () {
    if (!fodoole.state.sessionId) {
      fodoole.state.sessionId = String(fodoole.randInt());
    }
    fodoole.onLoad(function (_) {
      // Create a telemetry array to store telemetry metrics
      const telemetryArray = new fodoole.TelemetryArray();

      // Measure the time taken to load the script
      if (window.fodooleLoadStartTime) {
        const event = new fodoole.TelemetryMetric('SCRIPT_LOAD_TIME', performance.now() - window.fodooleLoadStartTime);
        telemetryArray.push(event);
      }
      fodoole.state.mainThreadTimeCore = performance.now();

      // Render any async content that was not rendered initially
      fodoole.asyncRenderContent();

      // Set the language code
      fodoole.setLanguageCode();

      // Common initialization logic
      fodoole.initResetCommon('INIT');

      // Bind non-scroll events
      fodoole.bindClickEvents(fodoole.config.clickEvents);
      if (!fodoole.config.enableContentGeneration) {
        // Only bind all clicks on the document if the page is not a PDP
        fodoole.bindDocumentClicks();
        // Bind checkout events
        fodoole.bindCheckoutEvents();
      }
      fodoole.bindIdleTimeEvents(fodoole.config.idleTime);
      fodoole.bindTabEvents();

      if (fodoole.config.searchAnalyticsEnabled && (!fodoole.config.searchAutoCompleteEnabled || fodoole.state.languageCode !== 'en')) { // FIXME
        fodoole.bindSearchBoxEvents(fodoole.config.searchBoxSelectors);
        fodoole.bindSearchResultEvents(fodoole.config.autoCompleteSelector);
      }

      // Fire any debounced events on page exit and send PAGE_EXIT event
      fodoole.beforeUnload(function (_) {
        // trigger any remaining debounced events
        for (let debouncer of fodoole.state.debouncedEvents) {
          debouncer.trigger();
        }

        // Send a PAGE_EXIT event
        const logEvent = new fodoole.PageAnalyticsEvent('PAGE_EXIT', null, null, null);
        logEvent.pushEvent();
      });

      // Send request for recommendation items
      // fodoole.sendRequestForRecommendation(); // FIXME: temporarily disabled

      // Get the network type
      if (navigator.connection) {
        const event = new fodoole.TelemetryMetric('NETWORK_TYPE', fodoole.getNetworkType());
        telemetryArray.push(event);
      }

      // Get PerformanceNavigationTiming data
      const [navigationTiming] = performance.getEntriesByType('navigation');
      const timingMetrics = ['domComplete', 'domContentLoadedEventEnd', 'domContentLoadedEventStart', 'domInteractive', 'loadEventEnd', 'loadEventStart'];
      for (let metric of timingMetrics) {
        const event = new fodoole.TelemetryMetric('PNT_' + fodoole.camelToSnake(metric), navigationTiming[metric]);
        telemetryArray.push(event);
      }

      // Measure the main thread time of the script 
      if (fodoole.state.mainThreadTimeCore) {
        const event = new fodoole.TelemetryMetric('THREAD_TIME_CORE', performance.now() - fodoole.state.mainThreadTimeCore);
        telemetryArray.push(event);
      }

      // Push all telemetry metrics, only for product pages
      if (fodoole.config.enableContentGeneration) {
        telemetryArray.pushEvents();
      }
    });
  };

  /**
   * Resets the session by resetting the session id and clearing the
   * events buffer and rendering the content again. This is mainly
   * used when a user returns to the site after a long period of time.
   * Or when idle time is hit while user is still on the site.
   */
  fodoole.resetSession = function () {
    // Reset session id and session data
    window.initFodooleConfig();

    // FIXME: hotfix for SACO
    if (fodoole.config.projectId === '2383417196' && localStorage.getItem("spartacus⚿⚿language")?.replaceAll('"', '') !== 'ar') {
      fodoole.config.rawContentSelectors = [];
    }

    // Reset the language
    fodoole.prepareSelectors();
    // Common reset logic
    fodoole.initResetCommon('RESET');
  };

  fodoole.initSession();
}
)();
