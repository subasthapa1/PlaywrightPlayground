const { chromium } = require('playwright');

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto('https://news.ycombinator.com/newest');

  const articles = await page.$$('span.age a');

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
