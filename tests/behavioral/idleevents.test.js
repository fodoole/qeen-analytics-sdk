const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe('Idle Events', () => {
    it('(Idle User) should observe an IDLE event and different session IDs', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            applyConfig: { config: { idleTime: 10_000 } },
            waitForSessionStart: true,
        }, {});

        const oldSessionId = await page.evaluate(() => window.fodoole.state.sessionId);

        const idleTime = await page.evaluate(() => window.fodoole.config.idleTime);

        await common.wait(idleTime);

        const newSessionId = await page.evaluate(() => window.fodoole.state.sessionId);

        expect(oldSessionId).not.toBe(newSessionId);

        const events = common.reduceToEventsArray(payloads);

        expect(events).toContainEqual(expect.objectContaining({ t: 'IDLE' }));
    });

    it('(Active User) should not observe an IDLE event', async () => {
        browser = await puppeteer.launch();

        const { page, payloads } = await common.setupTest(browser, {
            url: common.pages.productPage,
            endpoint: common.endpoints.pageLevelAnalytics,
            json: true,
            applyConfig: { config: { idleTime: 10_000 } },
            waitForSessionStart: true,
        }, {});

        const idleTime = await page.evaluate(() => window.fodoole.config.idleTime);

        await common.wait(idleTime / 2);
        
        await page.mouse.move(0, 0);

        await common.wait(idleTime / 2);

        const events = common.reduceToEventsArray(payloads);
        expect(events).not.toContainEqual(expect.objectContaining({ t: 'IDLE' }));
    });
});