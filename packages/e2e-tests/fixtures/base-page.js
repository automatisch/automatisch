const path = require('node:path');

/**
 * @typedef {(
 *   'default' | 'success' | 'warning' | 'error' | 'info'
 * )} SnackbarVariant - Snackbar variant types in notistack/v3, see https://notistack.com/api-reference
 */

export class BasePage {
  screenshotPath = '/';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.snackbar = page.locator('*[data-test^="snackbar"]');
    this.pageTitle = this.page.getByTestId('page-title');
  }

  /**
   * Finds the latest snackbar message and extracts relevant data
   * @param {string | undefined} testId
   * @returns {(
   *  null | {
   *    variant: SnackbarVariant,
   *    text: string,
   *    dataset: { [key: string]: string }
   *  }
   * )}
   */
  async getSnackbarData(testId) {
    if (!testId) {
      testId = 'snackbar';
    }
    const snack = this.page.getByTestId(testId);
    return {
      variant: await snack.getAttribute('data-snackbar-variant'),
      text: await snack.evaluate((node) => node.innerText),
      dataset: await snack.evaluate((node) => {
        function getChildren(n) {
          return [n].concat(
            ...Array.from(n.children).map((c) => getChildren(c))
          );
        }
        const datasets = getChildren(node).map((n) =>
          Object.assign({}, n.dataset)
        );
        return Object.assign({}, ...datasets);
      }),
    };
  }

  /**
   * Closes all snackbars, should be replaced later
   */
  async closeSnackbar() {
    const snackbars = await this.snackbar.all();
    for (const snackbar of snackbars) {
      await snackbar.click();
    }
    for (const snackbar of snackbars) {
      await snackbar.waitFor({ state: 'detached' });
    }
  }

  async clickAway() {
    await this.page.locator('body').click({ position: { x: 0, y: 0 } });
  }

  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join(
      'output/screenshots',
      this.screenshotPath,
      plainPath
    );

    return await this.page.screenshot({ path: computedPath, ...restOptions });
  }

  async isMounted() {
    await this.pageTitle.waitFor({ state: 'attached' });
  }
}
