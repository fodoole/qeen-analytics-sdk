const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe('Page View', () => {
    it('(Page View and Content Served) should see content replaced and observe PAGE_VIEW and CONTENT_SERVED events', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        }, {});

        const replacedTitle = await page.$eval('.title', el => el.innerText);
        const replacedSubtitle = await page.$eval('.subtitle', el => el.innerText);

        expect(replacedTitle).toBe('TITLE REPLACED');
        expect(replacedSubtitle).toBe('SUBTITLE REPLACED');

        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events).toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));
    });

    it('(Page View and No Content Served) should not see content replaced and observe PAGE_VIEW event only', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            applyConfig: { state: { contentServed: true } },
            waitForSessionStart: true,
        }, {});

        const replacedTitle = await page.$eval('.title', el => el.innerText);
        const replacedSubtitle = await page.$eval('.subtitle', el => el.innerText);
        expect(replacedTitle).toBe('TITLE');
        expect(replacedSubtitle).toBe('SUBTITLE');

        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events).not.toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));
    });

    it('(Page View Label) should observe a different label for the PAGE_VIEW between an initial and subsequent session', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        }, {});

        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events).toContainEqual(expect.objectContaining({ l: 'INIT' }));

        payloads.length = 0;

        await page.evaluate(() => window.fodoole.resetSession());
        await common.waitForSessionStart(page);

        const events2 = common.reduceToEventsArray(payloads);
        expect(events2).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events2).toContainEqual(expect.objectContaining({ l: 'RESET' }));
    });

    it('(Page View Event Visibility) should only see the PAGE_VIEW event if the page is visible', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
        }, {});

        const newPage = await browser.newPage();
        await newPage.goto('about:blank');
        await newPage.bringToFront();

        payloads.length = 0;

        await page.reload();
        await common.waitForSessionStart(page);

        const events = common.reduceToEventsArray(payloads);
        expect(events).not.toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));

        payloads.length = 0;

        await page.bringToFront();

        await common.waitForSessionStart(page);

        const events2 = common.reduceToEventsArray(payloads);
        expect(events2).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
    });

    it('(Site-wide) should observe PAGE_VIEW but not CONTENT_SERVED when content generation is disabled', async () => {
        browser = await puppeteer.launch();

        const { _, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        });

        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events).not.toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));
    });

    it('(Reset Session Consistency/Content Served) should observe a new session and CONTENT_SERVED after resetting the session', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            applyConfig: { config: { idleTime: 10_000 } },
            waitForSessionStart: true,
        });

        await common.wait(2700);
        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events).toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));

        payloads.length = 0;
        await page.evaluate(() => window.fodoole.resetSession());
        await common.waitForSessionStart(page);

        const events2 = common.reduceToEventsArray(payloads);
        expect(events2).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events2).toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));
    });

    it('(Reset Session Consistency/No Content Served) should observe a new session but no CONTENT_SERVED after resetting the session', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            applyConfig: { config: { idleTime: 10_000 }, state: { contentServed: false } },
            waitForSessionStart: true,
        });

        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events).not.toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));

        payloads.length = 0;
        page.evaluate(() => window.fodoole.resetSession());
        await common.waitForSessionStart(page);

        const events2 = common.reduceToEventsArray(payloads);
        expect(events2).toContainEqual(expect.objectContaining({ t: 'PAGE_VIEW' }));
        expect(events2).not.toContainEqual(expect.objectContaining({ t: 'CONTENT_SERVED' }));
    });
});