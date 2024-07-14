const { chromium } = require('playwright');

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto('https://news.ycombinator.com/newest');

  // Scroll down to ensure we load enough articles (about 100 articles)
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(1000); // wait a bit for the page to load
  }

  // Extract timestamps of the first 100 articles
  const articles = await page.$$('span.age a');

  if (articles.length < 100) {
    console.log('There are less than 100 articles loaded.');
    await browser.close();
    return;
  }

  const timestamps = [];
  for (let i = 0; i < 100; i++) {
    const timestampText = await articles[i].innerText();
    timestamps.push(timestampText);
  }

  // Convert timestamps to Date objects for comparison
  const now = new Date();
  const parsedTimestamps = timestamps.map(ts => {
    const [value, unit] = ts.split(' ');
    const number = parseInt(value);
    switch (unit) {
      case 'minute':
      case 'minutes':
        return new Date(now.getTime() - number * 60 * 1000);
      case 'hour':
      case 'hours':
        return new Date(now.getTime() - number * 60 * 60 * 1000);
      case 'day':
      case 'days':
        return new Date(now.getTime() - number * 24 * 60 * 60 * 1000);
      default:
        return now; // for now, assume all other cases are "now"
    }
  });

  // Validate that the timestamps are sorted from newest to oldest
  const isSorted = parsedTimestamps.every((date, index, arr) => {
    return index === 0 || date <= arr[index - 1];
  });

  if (isSorted) {
    console.log('The articles are sorted from newest to oldest.');
  } else {
    console.log('The articles are NOT sorted from newest to oldest.');
  }

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
