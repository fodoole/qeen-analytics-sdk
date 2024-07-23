const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe.skip('Load Events', () => {
    it('(On Load) should observe the side effects of a function on load', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        await page.evaluate(() => { window.testCounter = 0; });
        await page.evaluate(() => { fodoole.onLoad(function () { window.testCounter++; }); });

        // Fake a page load by sending DOMContentLoaded event
        await page.evaluate(() => { document.dispatchEvent(new Event('DOMContentLoaded')); });
        const testCounter = await page.evaluate(() => window.testCounter);

        expect(testCounter).toBe(1);
    });

    it('(Before Unload) should observe the side effects of a function before unload', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        await page.evaluate(() => { window.testCounter = 0; });
        await page.evaluate(() => { fodoole.beforeUnload(function () { window.testCounter++; }); });

        // Fake a page unload by sending beforeunload event
        await page.evaluate(() => {
            const event = new Event('beforeunload', { bubbles: false, });
            window.dispatchEvent(event);
        });
        const testCounter = await page.evaluate(() => window.testCounter);

        expect(testCounter).toBe(1);
    });
});
