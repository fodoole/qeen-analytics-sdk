const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe('Scroll Events', () => {
    it('(Scroll Events) should observe a SCROLL_TITLE and SCROLL_DESCRIPTION events', async () => {
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
    
    it('(Multi Scroll Events) should observe a SCROLL_DESCRIPTION and exactly one SCROLL_IMAGES event', async () => {
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

    it('(Scroll Event Mutation Observer) should observe a SCROLL_DESCRIPTION event', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            waitForSessionStart: true,
        }, {});
    
        await page.evaluate(() => {
            const description = document.querySelector('p.description');
            description.parentNode.removeChild(description);
        });
    
        await common.wait(2000);
    
        await page.evaluate(() => {
            const description = document.createElement('p');
            description.className = 'description';
            description.textContent = 'This is the description';
    
            const textContainer = document.querySelector('div.text-container');
            textContainer.insertBefore(description, textContainer.childNodes[1]);
        });
    
        const description = await page.$('p.description');
        await page.evaluate(description => description.scrollIntoView(false), description);
    
        await common.wait(50);
    
        const events = common.reduceToEventsArray(payloads);
        expect(events).toContainEqual(expect.objectContaining({ t: 'SCROLL', l: 'SCROLL_DESCRIPTION'}));
    });
});