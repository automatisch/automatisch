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
    this.snackbar = this.page.locator('.notistack-MuiContent');
  }

  /**
   * Finds the latest snackbar message and extracts relevant data
   * @returns {(
   *  null | {
   *    variant: SnackbarVariant,
   *    text: string,
   *    dataset: { [key: string]: string }
   *  }
   * )} 
   */
  async getSnackbarData () {
    if (await this.snackbar.count() === 0) {
      return null;
    }
    const snack = this.snackbar.first(); // uses flex: column-reverse
    const classList = await snack.evaluate(node => Array.from(node.classList));
    /** @type SnackbarVariant */
    let variant = 'default';
    if (classList.includes('notistack-MuiContent-success')) {
      variant = 'success'
    } else if (classList.includes('notistack-MuiContent-warning')) {
      variant = 'warning'
    } else if (classList.includes('notistack-MuiContent-error')) {
      variant = 'error'
    } else if (classList.includes('notistack-MuiContent-info')) {
      variant = 'info'
    }
    return {
      variant,
      text: await snack.evaluate(node => node.innerText),
      dataset: await snack.evaluate(node => {
        function getChildren (n) {
          return [n].concat(
            ...Array.from(n.children).map(c => getChildren(c))
          );
        }
        const datasets = getChildren(node).map(
          n => Object.assign({}, n.dataset)
        );
        return Object.assign({}, ...datasets);
      })
    };
  }

  /**
   * Closes all snackbars, should be replaced later
   */
  async closeSnackbar () {
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
}
