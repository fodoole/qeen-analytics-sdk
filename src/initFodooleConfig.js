/**
 * This file is used to initialize the configuration for the SDK.
 */
window.initFodooleConfig = function () {
	window.fodoole = window.fodoole || {};
	window.fodoole.state = fodoole.state || {};
	window.fodoole.state.contentServed = false;
	window.fodoole.state.recommendationServed = false;

	window.fodoole.config = {
		analyticsEndpoint: '/log',
		searchAnalyticsEndpoint: '/search-logging',
		telemetryEndpoint: '/telemetry',
		// analyticsEndpoint: 'http://localhost:8080/log', // comment when done using
		// searchAnalyticsEndpoint: 'http://localhost:8080/search-logging', // comment when done using
		// telemetryEndpoint: 'http://localhost:8080/telemetry', // comment when done using
		recommendationEndpoint: 'http://localhost:8080/recommended',
		searchEndpoint: 'http://localhost:8080/search-results',
		projectId: '123',
		contentServingId: '[SET_VIA_SERVER_TEMPLATE]',
		contentId: '[SET_VIA_SERVER_TEMPLATE]',
		enableContentGeneration: true,
		// enableContentGeneration: false, // comment when done using
		idleTime: 10000,
		gtagIntegrationEnabled: false,
		// gtagIntegrationEnabled: true, // comment when done using
		gtagLabels: ['ADD_TO_CART', 'BUY_NOW', 'SEND_AS_GIFT', 'CLICK_IMPORTANT'],
		checkoutAmountSelector: '.cart-total',
		clickEvents: [
			{ 'label': 'CLICK_IMPORTANT', 'value': '#important-button' },
			{ 'label': 'CLICK_NORMAL', 'value': 'body > div.container > button.button.normal' },
			{ 'label': 'CLICK_GROUP', 'value': '.group .button' },
			{ 'label': 'CLICK_ASYNC', 'value': '.async' },
		],
		scrollEvents: [
			{ 'label': 'SCROLL_TITLE', 'value': '.title' },
			{ 'label': 'SCROLL_DESCRIPTION', 'value': 'body > div.text-container > p' },
			{ 'label': 'SCROLL_IMAGES', 'value': '.image' },
			{ 'label': 'SCROLL_ASYNC', 'value': '.async' },
		],
		rawContentSelectors: [
			{
				'uid': '0001',
				'path': '.title',
				'value': 'TITLE REPLACED'
			},
			{
				'uid': '0002',
				'path': '#subtitle',
				'value': 'SUBTITLE REPLACED'
			},
			{
				'uid': '0003',
				'path': '.async',
				'value': 'ASYNC CONTENT REPLACED'
			},
			{
				'uid': '0004',
				'path': 'html > head > title',
				'value': 'Dev Playground'
			},
		],
		contentSelectors: {},
		titleContent: '',
		searchAnalyticsEnabled: true,
		searchAutoCompleteEnabled: true,
		searchBoxSelectors: ['input[type="text"],#async-search-box'],
		autoCompleteSelector: '.search-results',
		searchClickEvents: [
			{ 'label': 'PRODUCT', 'value': '.search-results-item.product', 'title': 'h3' },
			{ 'label': 'CATEGORY', 'value': '.search-results-item.category', 'title': 'h3' },
		],
		postRenderFunction: function () {
			let btn = document.querySelectorAll('.group .button')[1];
			if (btn) {
				btn.style.backgroundColor = 'gold';
			}
		},
	};

	window.fodoole.state = {
		sessionId: null,
		isResetSession: false,
		shouldRunServingCallback: window.fodoole.state.shouldRunServingCallback || new Set(),
		lastTabExitTime: 0,
		fodooleDeviceId: null,
		lastIdleTime: Date.now(),
		shouldPushEventsToGA4: fodoole.config.gtagIntegrationEnabled && fodoole.config.enableContentGeneration && typeof gtag === 'function',
		debounceTime: 500,
		debouncedEvents: [],
		recommendationContent: window.fodoole.state.recommendationSelectors || { "#recommendedItems": { "replace_text": "<div class=\"recommended_product\"><img class=\"recommended_product_image\" src=\"https://picsum.photos/id/11/256/256\" alt=\"Product Image\"/><h4 class=\"recommended_product_title\">Title of Product (replaced)</h4></div>" } },
		recommendationSelectors: window.fodoole.state.recommendationSelectors || {},
		scrollObservedElements: [],
		searchValue: window.fodoole.state.searchValue || null,
		lastSearchValue: window.fodoole.state.lastSearchValue || null,
		searchBoxes: window.fodoole.state.searchBoxes || [],
		boundSearchBoxes: window.fodoole.state.boundSearchBoxes || [],
		boundSearchAnalyticsAutoComplete: window.fodoole.state.boundSearchAnalyticsAutoComplete || [],
		cachedSearchItems: window.fodoole.state.cachedSearchItems || { 'items': [], 'query': '' },
		mainThreadTimeCore: null,
		mainThreadTimeSearch: null,
		contentReplacementTime: null,
		postRenderRan: false,
		asyncContentSelectors: window.fodoole.state.asyncContentSelectors || {},
		isCheckoutPage: window.location.href.includes('checkout'),
	};
	/** Sometimes we need to save the previous state of some properties and use the
			`prop: window.fodoole.state.prop || defaultValue` pattern to avoid
			overwriting when resetting the session due to an IDLE event. This is 
			generally used for properties that aren't applicable as page-session-level
			properties, such as search and recommendation data.
	**/

};
