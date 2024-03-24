const { setTimeout } = require('timers/promises');

function getRandomTimeout() {
  const minNumberString = Number(process.env.DEBUG_RESPONSE_DELAY_MIN);
  const maxNumberString = Number(process.env.DEBUG_RESPONSE_DELAY_MAX);
  let min = 100,
    max = 1000;
  if (!isNaN(minNumberString) && minNumberString >= 0) {
    min = minNumberString;
  }
  if (!isNaN(maxNumberString) && maxNumberString > min) {
    max = maxNumberString;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {import('@playwright/test').Page} page
 */
async function initRandomResponseTimes(page) {
  await page.route('**/*', async (route) => {
    await setTimeout(getRandomTimeout());
    await route.continue();
  });
}

module.exports = {
  initRandomResponseTimes,
};
