const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
  await browser.close();
});

describe('Scroll Events', () => {
  it('(Scroll Events) should observe a SCROLL events', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const title = await page.$('.productTitle');
    await page.evaluate(title => title.scrollIntoView(false), title);
    await common.wait(50);
    
    const description = await page.$('#desc');
    await page.evaluate(description => description.scrollIntoView(false), description);
    await common.wait(200);

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'SCROLL', l: 'SCROLL_TITLE' }));
    expect(events).toContainEqual(expect.objectContaining({ t: 'SCROLL', l: 'SCROLL_DESC' }));
  });

  it('(Multi Scroll Events) should observe a one SCROLL event per label', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const description = await page.$('.desc');
    await page.evaluate(description => description.scrollIntoView(false), description);
    await common.wait(200);

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'SCROLL', l: 'SCROLL_DESC' }));
    expect(events.filter(event => event.l === 'SCROLL_DESC').length).toBe(1);
  });
});