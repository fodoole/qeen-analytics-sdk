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

##Initialization
To initialize the SDK, call the FodooleAnalyticsInit function after rendering the content on each page. This function creates a new page session and sets up event tracking.

```javascript
FodooleAnalyticsInit({
  contentServingId: string | number,
  contentId: string | number,
  clickEvents: Array<EventConfig>,
  scrollEvents: Array<EventConfig>
});
```

### Parameters

- contentServingId: The ID of the content serving request. Use null or 0 if no optimized content was rendered.
- contentId: The ID of the content being displayed.
- clickEvents: An array of custom click event configurations.
- scrollEvents: An array of custom scroll event configurations.

### EventConfig Object

```javascript
{
  label: string,
  value: string
}
```

- **label:** A unique identifier for the event.
- **value:** A CSS selector that targets the element(s) to track.

#### Example
```
function renderPage(pageData) {
  // Render your page content here
  displayContent(pageData);

  // Initialize Fodoole Analytics after rendering
  FodooleAnalyticsInit({
    contentServingId: pageData.contentServingId,
    contentId: pageData.contentId,
    clickEvents: [
      {label: 'CLICK_IMPORTANT', value: '#important-button'},
      {label: 'CLICK_NORMAL', value: 'body > div.container > button.button.normal'},
      {label: 'CLICK_GROUP', value: '.group .button'},
      {label: 'CLICK_ASYNC', value: '.async'},
    ],
    scrollEvents: [
      {label: 'SCROLL_TITLE', value: '.title'},
      {label: 'SCROLL_DESCRIPTION', value: 'body > div.text-container > p'},
      {label: 'SCROLL_IMAGES', value: '.image'},
      {label: 'SCROLL_ASYNC', value: '.async'},
    ]
  });
}
```

### Session Management

The SDK automatically manages the following:

- User ID
- Page Session ID
- Language detection

When navigating to a new page in your SPA, make sure to call FodooleAnalyticsInit again. This will:

1. Signal an EXIT event for the previous session
2. Initialize a new session for the current page

### Event Tracking
#### Automatic Events

The SDK automatically tracks the following events:

- **Content Served:** Fired when a session is initialized with valid contentId and contentServingId.
- **Exit:** Fired when navigating away from a page or closing the browser.

#### Custom Click and Scroll Events

Instead of enabling general click and scroll tracking, you can now define specific elements to track for clicks and scrolls. These are configured during initialization:

- **Click Events:** Defined in the clickEvents array, these will trigger when a user clicks on an element matching the specified selector.
- **Scroll Events:** Defined in the scrollEvents array, these will trigger when a user scrolls to an element matching the specified selector.

The SDK will automatically track these custom events based on the configuration provided during initialization.

### Best Practices

1. Initialization Timing: Always call FodooleAnalyticsInit after rendering the page content. This ensures accurate tracking of the displayed content.

2. SPA Navigation: Re-initialize the SDK on every page navigation in your SPA to properly track new sessions and exit events.

3. Content Serving ID: Use null or 0 for the contentServingId when no optimized content is rendered.

4. Custom Event Configuration:

Use clear and descriptive labels for your custom events to make analysis easier.
Follow the specific naming convention for click and scroll events:

Click events should always start with CLICK_, e.g., CLICK_ADD_TO_CART
Scroll events should always start with SCROLL_, e.g., SCROLL_PRODUCT_DESCRIPTION

Be specific with your CSS selectors to target exactly the elements you want to track.
Consider the performance impact of tracking too many elements, especially for scroll events.

5. Naming Convention Examples:

For a newsletter signup button: CLICK_NEWSLETTER_SIGNUP
For scrolling to the reviews section: SCROLL_PRODUCT_REVIEWS
For clicking a product image: CLICK_PRODUCT_IMAGE
For scrolling to the footer: SCROLL_PAGE_FOOTER

6. Consistent Naming: Maintain consistency in your naming across different pages and features. This will make it easier to analyze data and create reports.

By following these guidelines and best practices, you'll be able to effectively integrate the Fodoole Analytics SDK into your single-page application, configure custom click and scroll events precisely, and gather valuable insights about user behavior and content performance.
