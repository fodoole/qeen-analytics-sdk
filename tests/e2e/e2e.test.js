const common = require('../common.js');
const puppeteer = require('puppeteer');
const { BigQuery } = require('@google-cloud/bigquery');
let browser;

afterEach(async () => {
    await browser.close();
});

const env = {
    PROJECT_ID: process.env.PROJECT_ID,
    BQ_DATASET: process.env.BQ_DATASET,
    BQ_EVENTS_TABLE: process.env.BQ_EVENTS_TABLE,
    BQ_EVENTS_TABLE_NPDP: process.env.BQ_EVENTS_TABLE_NPDP,
}

// The time to wait for the events to be logged in BigQuery.
const loggingWaitTime = 5000;

const hostAddress = process.env.ANALYTICS_HOST || 'localhost';
const port = process.env.PORT || 8080;
const serverURL = `http://${hostAddress}:${port}`;

const QueryParams = {
    PAGE_SESSION_ID: 'page_session_id',
    CONTENT_SERVING_ID: 'content_serving_id',
    LOGGING_TIMESTAMP: 'logging_timestamp',
    EVENT_TIMESTAMP: 'event_timestamp'
};

/**
 * Executes a query in BigQuery.
 * @param {string} paramName The parameter name to query for.
 * @param {string} paramValue The parameter value to query for.
 * @param {string} table The table to query from.
 * @param {Number} timestampName The timestamp name to query for.
 * @param {Number} timestampValue The timestamp value to query for.
 * @returns {Promise<void>} A promise that resolves when the query is complete.
 */
async function executeQuery(paramName, paramValue, table, timestampName, timestampValue = 0) {
    const bigqueryClient = new BigQuery();

    const query = `SELECT * FROM \`${env.PROJECT_ID}.${env.BQ_DATASET}.${table}\` WHERE ${paramName} = '${paramValue}' AND ${timestampName} > ${timestampValue}`;

    const options = {
        query: query,
        location: 'EU',
    };

    const [rows] = await bigqueryClient.query(options);

    return rows;
}

/**
 * Executes a query in BigQuery based on the Event class.
 * @param {string} sessionId The session ID to query for.
 * @param {string} table The table to query from.
 * @param {Number} timestamp The timestamp to query for.
 * @returns {Promise<void>} A promise that resolves when the query is complete.
 */
async function executeQueryEvent(sessionId, table, timestamp = 0) {
    return executeQuery(QueryParams.PAGE_SESSION_ID, sessionId, table, QueryParams.EVENT_TIMESTAMP, timestamp);
}

/**
 * Denullifies an object. Number values are converted to 0, string values are converted to ''.
 * @param {Object} obj The object to denullify.
 * @param {string[]} zeroProps The properties to convert to 0.
 * @returns {Object} The denullified object.
 */
function denullify(obj, zeroProps = []) {
    let newObj = { ...obj };
    Object.keys(newObj).forEach(key => {
        if (newObj[key] === null) {
            newObj[key] = zeroProps.includes(key) ? 0 : '';
        }
    });
    return newObj;
}

/**
 * Runs the page-level analytics test.
 * @param {Page} page The page to run the test on.
 * @returns {Object} The session IDs before and after the test.
 */
async function pageLevelAnalyticsTest(page) {
    // CONTENT_SERVED/CHECKOUT
    // RECOMMENDATION_SERVED
    // PAGE_VIEW
    // await content served or page visibility; done in test setup

    const sessionId1 = await page.evaluate(() => window.fodoole.state.sessionId);
    const debounceTime = await page.evaluate(() => window.fodoole.state.debounceTime);
    const idleTime = await page.evaluate(() => window.fodoole.config.idleTime);

    // CLICK
    await page.click('#important-button');

    // SCROLL
    const title = await page.$('.title');
    await page.evaluate(title => title.scrollIntoView(false), title);

    await common.wait(debounceTime + 50);

    // TAB_SWITCH
    const newPage = await browser.newPage();
    await newPage.goto('about:blank');
    await newPage.bringToFront();

    await common.wait(50);
    await page.bringToFront();

    // IDLE
    await common.wait(idleTime);
    const sessionId2 = await page.evaluate(() => window.fodoole.state.sessionId);

    // PAGE_EXIT
    await page.reload();

    return { sessionId1, sessionId2 };
}

/**
 * Processes the page-level analytics test.
 * @param {Object[]} payloads The payloads to process.
 * @param {string} sessionId1 The first session ID.
 * @param {string} sessionId2 The second session ID.
 * @param {Number} startTime The start time of the test.
 * @param {string} table The table to query from.
 * @returns {Object} The mutated rows and the matching events.
 */
async function processPageLevelAnalyticsTest(payloads, sessionId1, sessionId2, startTime, table) {
    const events = common.reduceToEventsArray(payloads);

    // Making sure we only get the events we're interested in
    const eventsOfInterest = events.filter(event => event.pid === sessionId1 || event.pid === sessionId2);

    // Give the events some time to be logged in BigQuery
    await common.wait(loggingWaitTime);

    const rows1 = await executeQueryEvent(sessionId1, table, startTime);
    const rows2 = await executeQueryEvent(sessionId2, table, startTime);
    const rows = rows1.concat(rows2);

    // Bind BigQuery column names to the expected event properties
    let rowsMutated = rows.map(row => {
        return {
            t: row.event_type,
            v: row.event_value,
            l: row.event_label,
            edp: row.event_dom_path,
            ts: row.event_timestamp,
            u: row.page_url,
            ua: row.user_agent,
            r: row.referrer_url,
            p: row.project_id,
            pid: row.page_session_id,
            csrvid: row.content_serving_id,
            cid: row.content_id,
            uid: row.user_device_id
        };
    });

    // Ensure that any event with a null property matches BigQuery's null value stand-in
    let eventsMatching = eventsOfInterest.map(event => denullify(event, ['v', 'ts']));

    // Delete the properties not stored in BigQuery
    eventsMatching = eventsMatching.map(event => { delete event['endpoint']; return event; });
    eventsMatching = eventsMatching.map(event => { delete event['npdp']; return event; });

    eventsMatching = common.sortObjects(eventsMatching, ['t', 'l']);
    rowsMutated = common.sortObjects(rowsMutated, ['t', 'l']);

    return { rowsMutated, eventsMatching };
}

// E2E Test
describe.skip('E2E/Integration', () => {
    if (Object.values(env).some(prop => prop === undefined)) {
        throw new Error('Please provide the necessary environment variables.');
    }

    it('(Page-Level Analytics) send page-level analytics events via the browser and observe these events in the database', async () => {
        const startTime = Date.now();
        const loggingURL = serverURL + common.endpoints.pageLevelAnalytics;
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: loggingURL,
            json: true,
            applyConfig: {
                config: {
                    analyticsEndpoint: loggingURL,
                }
            },
            waitForSessionStart: true,
        });

        // Run common page-level analytics test
        const { sessionId1, sessionId2 } = await pageLevelAnalyticsTest(page);

        // Process the page-level analytics test
        const { rowsMutated, eventsMatching } = await processPageLevelAnalyticsTest(payloads, sessionId1, sessionId2, startTime, env.BQ_EVENTS_TABLE);
        expect(rowsMutated).toEqual(eventsMatching);
    });

    it('(Page-Level Analytics/Non-PDP) send page-level analytics (non-PDP) events via the browser and observe these events in the database', async () => {
        const startTime = Date.now();
        const loggingURL = serverURL + common.endpoints.pageLevelAnalytics;
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage + '?checkout',
            endpoint: loggingURL,
            json: true,
            applyConfig: {
                config: {
                    analyticsEndpoint: loggingURL,
                    enableContentGeneration: false,
                    contentId: '-',
                }
            },
            waitForVisibility: true,
        });

        // Run common page-level analytics test
        const { sessionId1, sessionId2 } = await pageLevelAnalyticsTest(page);

        // CLICK:CLICK_NON_PDP
        await page.click('.title');

        // Process the page-level analytics test
        const { rowsMutated, eventsMatching } = await processPageLevelAnalyticsTest(payloads, sessionId1, sessionId2, startTime, env.BQ_EVENTS_TABLE_NPDP);
        expect(rowsMutated).toEqual(eventsMatching);
    });
});