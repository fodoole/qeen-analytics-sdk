const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
	await browser.close();
});

describe('Utilities', () => {
	it('(Random Integer) should generate a random integer between 10^15 and 10^16 - 1', async () => {
		browser = await puppeteer.launch();

		const { page, _ } = await common.setupTest(browser, {
			url: common.blankURL,
			waitForVisibility: true,
		}, {});

		const randomInt = await page.evaluate(() => String(fodoole.randInt()));

		expect(randomInt).toMatch(/^[0-9]+$/);
		expect(randomInt.length).toBeGreaterThanOrEqual(15);
	});

	it('(Limit) should limit a number to a given range', async () => {
		browser = await puppeteer.launch();

		const { page, _ } = await common.setupTest(browser, {
			url: common.blankURL,
			waitForVisibility: true,
		}, {});

		const randomInt = await page.evaluate(() => String(fodoole.randInt()));

		expect(randomInt).toMatch(/^[0-9]+$/);
		expect(randomInt.length).toBeGreaterThanOrEqual(15);
	});
});
