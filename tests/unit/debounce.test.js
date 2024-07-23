const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
    await browser.close();
});

describe.skip('Debouncer', () => {
    it('(Debounce Delay) should observe the side effects of a debounced event after a delay', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        await page.evaluate(() => { window.testCounter = 0; });
        await page.evaluate(() => { window.debouncedFunction = fodoole.debounce(function () { window.testCounter++; }, 1000); });

        await page.evaluate(() => debouncedFunction.debounced());
        await common.wait(500);
        const testCounter1 = await page.evaluate(() => window.testCounter);
        await common.wait(500);
        const testCounter2 = await page.evaluate(() => window.testCounter);

        expect(testCounter1).toBe(0);
        expect(testCounter2).toBe(1);
    });

    it('(Debounce Anti-Spam) should observe the side effects of a debounced event once if spammed', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        await page.evaluate(() => { window.testCounter = 0; });
        await page.evaluate(() => { window.debouncedFunction = fodoole.debounce(function () { window.testCounter++; }, 1000); });

        await page.evaluate(() => {
            const button = document.createElement('button');
            button.id = 'testButton';
            button.onclick = debouncedFunction.debounced;
            document.body.appendChild(button);
        });

        for (let i = 0; i < 10; i++) {
            await page.click('#testButton');
        }
        await common.wait(1000);
        const testCounter = await page.evaluate(() => window.testCounter);

        expect(testCounter).toBe(1);
    });

    it('(Debounce Clear) should not observe the side effects of a debounced event when cleared', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        await page.evaluate(() => { window.testCounter = 0; });
        await page.evaluate(() => { window.debouncedFunction = fodoole.debounce(function () { window.testCounter++; }, 1000); });

        await page.evaluate(() => debouncedFunction.debounced());
        await page.evaluate(() => debouncedFunction.clear());
        await common.wait(1000);
        const testCounter = await page.evaluate(() => window.testCounter);

        expect(testCounter).toBe(0);
    });

    it('(Debounce Trigger) should observe the side effects of a debounced event early when triggered', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        await page.evaluate(() => { window.testCounter = 0; });
        await page.evaluate(() => { window.debouncedFunction = fodoole.debounce(function () { window.testCounter++; }, 1000); });

        await page.evaluate(() => debouncedFunction.debounced());
        await page.evaluate(() => debouncedFunction.trigger());
        await common.wait(50);
        const testCounter = await page.evaluate(() => window.testCounter);

        expect(testCounter).toBe(1);
    });

    it('(Debounce Flush) should observe the side effects debounced events immediately when flushed', async () => {
        browser = await puppeteer.launch();

        const { page, _ } = await common.setupTest(browser, {
            url: common.blankURL,
            waitForVisibility: true,
        }, {});

        await page.evaluate(() => { window.testCounter = 0; });
        await page.evaluate(() => { window.debouncedFunction = fodoole.debounce(function () { window.testCounter++; }, 1000); });

        await page.evaluate(() => debouncedFunction.debounced());
        await page.evaluate(() => debouncedFunction.trigger());
        await common.wait(50);
        const testCounter = await page.evaluate(() => window.testCounter);

        expect(testCounter).toBe(1);
    });
});
