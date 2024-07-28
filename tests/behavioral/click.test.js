const common = require('../common.js');
const puppeteer = require('puppeteer');
let browser;

afterEach(async () => {
  await browser.close();
});

describe('Click Events', () => {
  it('(Click) should observe a CLICK event', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    await page.click('#add-to-cart');

    const debounceTime = await page.evaluate(() => window.qeen.state.debounceTime);

    await common.wait(debounceTime + 50);

    const events = common.reduceToEventsArray(payloads);
    expect(events).toContainEqual(expect.objectContaining({ t: 'CLICK', l: 'ADD_TO_CART' }));
  });

  it('(Click Group) should observe 3 CLICK events with the same label', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.group .button')).map(button => {
        let path = [];
        let node = button;
        while (node !== document.body) {
          let name = node.nodeName;
          if (node.id) {
            name += `#${node.id}`;
          }
          if (node.className) {
            name += `.${node.className.replace(/\s+/g, '.')}`;
          }
          path.unshift(name);
          node = node.parentNode;
        }
        return path.join(' > ');
      });
    });

    const debounceTime = await page.evaluate(() => window.qeen.state.debounceTime);

    for (let i = 0; i < buttons.length; i++) {
      await page.click(buttons[i]);
      await common.wait(debounceTime + 50);
    }

    const events = common.reduceToEventsArray(payloads);
    const clickGroupEvents = events.filter(event => event.l === 'CLICK_GROUP');
    expect(clickGroupEvents.length).toBe(3);
  });

  it('(Click Debounce) should observe a single CLICK event', async () => {
    browser = await puppeteer.launch();

    const { page, payloads } = await common.setupTest(browser, {
      url: common.pages.productPage,
      endpoint: common.endpoints.pageLevelAnalytics,
      json: true,
      waitForSessionStart: true,
    }, {});

    const debounceTime = await page.evaluate(() => window.qeen.state.debounceTime);

    for (let i = 0; i < 5; i++) {
      await page.click('#add-to-cart');
    }

    await common.wait(debounceTime);

    const events = common.reduceToEventsArray(payloads);
    const clickEvents = events.filter(event => event.t === 'CLICK');
    expect(clickEvents.length).toBeLessThanOrEqual(1);
  });
});