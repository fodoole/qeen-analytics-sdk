const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe.skip('Scroll Events', () => {
    it('(Scroll Events) should observe a SCROLL events', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        }, {});

        const title = await page.$('.title');
        await page.evaluate(title => title.scrollIntoView(false), title);

        await common.wait(50);

        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'SCROLL', l: 'SCROLL_TITLE'}));
        expect(events).toContainEqual(expect.objectContaining({ t: 'SCROLL', l: 'SCROLLS_DESCRIPTION'}));
    });
    
    it('(Multi Scroll Events) should observe a one SCROLL event per label', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        }, {});

        const description = await page.$('body > div.text-container > p');
        await page.evaluate(description => description.scrollIntoView(false), description);

        const images = await page.$$('.image');
        for (const image of images) {
            await page.evaluate(image => image.scrollIntoView(false), image);
        }
        
        await common.wait(50);

        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'SCROLL', l: 'SCROLL_DESCRIPTION'}));
        expect(events.filter(event => event.l === 'SCROLL_IMAGES').length).toBe(1);
    });
});