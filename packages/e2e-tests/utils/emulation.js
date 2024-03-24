function getEmulationSpeed() {
  let rateString = process.env.DEBUG_CPU_THROTTLING_RATE;
  if (rateString && Number(rateString) >= 1) {
    return Number(rateString);
  }
  console.warn('You can set DEBUG_CPU_THROTTLING_RATE in the .env');
  return 1;
}

/**
 * Initializes the browser emulation speed for chrome browsers
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').BrowserContext} context
 */
async function initEmulationSpeed(page, context) {
  const emulationSpeed = getEmulationSpeed();
  const client = await context.newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 2 });
}

module.exports = { initEmulationSpeed };
