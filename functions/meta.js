const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto('https://jasontcrabtree.com');

  const title = await page.title();
  const description = await page.$eval(
    'meta[name="description"]',
    (element) => element.content
  );
  const image = await page.$eval(
    'meta[property="og:image"]',
    (element) => element.content
  );

  // Notice at the end, we’re also using the close method. We want to make sure we’re always cleaning up our browser to avoid hanging requests and wasted resources.
  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'OK',
      page: {
        title,
        description,
        image,
      },
    }),
  };
};
