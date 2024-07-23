const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe('Page Exit', () => {
    it('(Page Exit) should observe a PAGE_EXIT event when exiting the page', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        }, {});

        await page.reload();

        const events = common.reduceToEventsArray(payloads);
        expect(events.some(event => event.t === 'PAGE_EXIT')).toBe(true);
        expect(events.some(event => event.t === 'PAGE_VIEW')).toBe(true);
        expect(events.some(event => event.t === 'CONTENT_SERVED')).toBe(true);
    });
    
    it('(Page Exit with Click) should observe a PAGE_EXIT and CLICK event when exiting the page', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        }, {});

        await page.click('#add-to-cart');

        await page.reload();

        const events = common.reduceToEventsArray(payloads);
        expect(events.some(event => event.t === 'PAGE_EXIT')).toBe(true);
        expect(events.some(event => event.t === 'CLICK')).toBe(true);
        expect(events.some(event => event.t === 'PAGE_VIEW')).toBe(true);
        expect(events.some(event => event.t === 'CONTENT_SERVED')).toBe(true);
    });
});