# Fodoole Analytics SDK Integration Guide for Single Page Applications

This guide will help you integrate the Fodoole Analytics SDK into your single-page application (SPA). The SDK allows you to track page sessions, content interactions, and custom events in your SPA.

## Table of Contents

1. [Installation](#installation)
2. [Initialization](#initialization)
3. [Session Management](#session-management)
4. [Event Tracking](#event-tracking)
5. [Best Practices](#best-practices)

## Installation

To install the Fodoole Analytics SDK, add the following script tag to your HTML file:

```html
<script src="https://cdn.qeen.ai/analytics-sdk.js"></script>
```

## Initialization
To initialize the SDK, call the FodooleAnalyticsInit function after rendering the content on each page. This function creates a new page session and sets up event tracking.

```js
FodooleAnalyticsInit({
  contentServingId: string,
  contentId: string,
  idleTime: number,
  clickEvents: Array<EventConfig>,
  scrollEvents: Array<EventConfig>,
});
```

### Parameters

- `contentServingId`: The ID of the content serving request. Use `"0"` if no optimized content was rendered.
- `contentId`: The ID of the content being displayed.
- `idleTime`: The maximum time before a session is reset due to user inactivity in milliseconds. Defaults to 5 minutes and can be up to 10 minutes.
- `clickEvents`: An array of custom click event configurations.
- `scrollEvents`: An array of custom scroll event configurations.

### EventConfig Object

```js
{
  label: string,
  value: string
}
```

- **label:** A unique identifier for the event.
- **value:** A CSS selector or JS path that targets the element(s) to track.

#### Basic Usage Example
```js
function renderPage(pageData) {
  // Render your page content here
  displayContent(pageData);

  // Initialize Fodoole Analytics after rendering
  FodooleAnalyticsInit({
    contentServingId: pageData.contentServingId,
    contentId: pageData.contentId,
    idleTime: 300000, 
    clickEvents: [
      {label: 'NAV_HOME', value: 'nav .home-link'},
      {label: 'NAV_PRODUCTS', value: 'nav .products-link'},
      {label: 'ADD_TO_CART', value: '.add-to-cart-button'},
    ],
    scrollEvents: [
      {label: 'PRODUCT_DETAILS', value: '.product-details'},
      {label: 'REVIEWS', value: '.reviews-section'},
      {label: 'FOOTER', value: 'footer'},
    ]
  });
}
```
#### Example with ReactJS

```jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AnalyticsWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to initialize Fodoole Analytics
    const initializeAnalytics = (pageData) => {
      FodooleAnalyticsInit({
        contentServingId: pageData.contentServingId,
        contentId: pageData.contentId,
        idleTime: 300000, 
        clickEvents: [
          {label: 'NAV_HOME', value: 'nav .home-link'},
          {label: 'NAV_PRODUCTS', value: 'nav .products-link'},
          {label: 'ADD_TO_CART', value: '.add-to-cart-button'},
        ],
        scrollEvents: [
          {label: 'PRODUCT_DETAILS', value: '.product-details'},
          {label: 'REVIEWS', value: '.reviews-section'},
          {label: 'FOOTER', value: 'footer'},
        ]
      });
    };

    const handlePageView = async () => {
      // Calling the API for content. User device ID must be passed in from the frontend
      const pageData = await fetchPageData(userDeviceId);
      
      // First, render your page content
      // This is where you'd typically update your React components

      // Then, render optimised content; you may handle errors here
      // This is implemented on your end
      renderContent(pageData);

      // Finally, initialize analytics
      initializeAnalytics(pageData);
    };

    handlePageView();
  }, [location]); // Re-run effect when location changes

  return <>{children}</>;
}

// Usage in your app
function App() {
  return (
    <Router>
      <AnalyticsWrapper>
        {/* Your routes and components */}
      </AnalyticsWrapper>
    </Router>
  );
}
```

### Session Management

The SDK automatically manages the following:

- User ID
- Page Session ID

When navigating to a new page in your SPA, make sure to call `FodooleAnalyticsInit`  again. This will:

1. Signal a `PAGE_EXIT` event for the previous session.
2. Initialize a new session for the current page.

### Event Tracking
#### Automatic Events

The SDK automatically tracks the following events:

- **`PAGE_VIEW`:** Fired when a session is initialized regardless if it has content or not.
- **`CONTENT_SERVED`:** Fired when a session is initialized with valid `contentId` and `contentServingId`.
- **`TAB_SWITCH:`:** Fired when the tab or browser is defocused or refocused with two possible labels: `EXIT` and `RETURN`.
- **`IDLE`:** Fired if a user does nothing on the page and the session exceeds `idleTime`. This will also create a new session. Defocusing the tab for a time longer than `idleTime` will also cause the session to be reset.
- **`PAGE_EXIT`:** Fired when navigating away from a page or closing the browser. Note that most mobile browsers will fire `TAB_SWITCH:EXIT` instead of `PAGE_EXIT`.

#### Custom Click and Scroll Events

Instead of enabling general click and scroll tracking, you can now define specific elements to track for clicks and scrolls. These are configured during initialization:

- **Click Events:** Defined in the `clickEvents` array, these will trigger when a user clicks on an element or elements matching the specified selector. Click events are debounced with a delay of 500ms.
- **Scroll Events:** Defined in the `scrollEvents` array, these will trigger when a user scrolls to an element or elements matching the specified selector. Every scroll event may only be fired once per session.

The SDK will automatically track these custom events based on the configuration provided during initialization.

### Best Practices

1. Initialization Timing: Always call FodooleAnalyticsInit after rendering the page content. This ensures accurate tracking of the displayed content.

2. SPA Navigation: Re-initialize the SDK on every page navigation in your SPA to properly track new sessions and exit events.

3. Content Serving ID: Use `"0"` for the `contentServingId` when no optimized content is rendered.

4. Custom Event Configuration:

Use clear and descriptive labels for your custom events to make analysis easier.
> [!NOTE]  
> `ADD_TO_CART` is a special click label that is used for analytics.

Be specific with your CSS selectors to target exactly the elements you want to track.


5. Consistent Naming: Maintain consistency in your naming across different pages and features. This will make it easier to analyze data and create reports.

By following these guidelines and best practices, you'll be able to effectively integrate the Fodoole Analytics SDK into your single-page application, configure custom click and scroll events precisely, and gather valuable insights about user behavior and content performance.
