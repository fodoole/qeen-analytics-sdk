const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe('Request Parameters', () => {
    it('(Request Parameters) should observe the correct request parameters', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        const requestParams = await page.evaluate(() => fodoole.getRequestParameters());
        const userDeviceId = await page.evaluate(() => fodoole.state.fodooleDeviceId);
        expect(requestParams).toEqual(`projectId=123&pageUrl=http%3A%2F%2Flocalhost%3A3000%2Fblank&userDeviceId=${userDeviceId}&referrerUrl=&languageTag=en&contentServingId=%5BSET_VIA_SERVER_TEMPLATE%5D&locale=en-GB&timezone=Asia%2FAmman&eventType=detail-page-view`);
    });
});
