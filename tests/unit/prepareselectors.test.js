const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe.skip('Prepare Selectors', () => {
    it('(Content Selectors) should observe the correct content selector bindings', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        const contentSelectors = await page.evaluate(() => fodoole.config.contentSelectors);
        expect(contentSelectors).toEqual({
            '#subtitle': 'SUBTITLE REPLACED',
            '.async': 'ASYNC CONTENT REPLACED',
            '.title': 'TITLE REPLACED'
        });
    });
});
