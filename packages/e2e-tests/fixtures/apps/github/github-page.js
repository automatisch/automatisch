const { BasePage } = require('../../base-page');
const { AddGithubConnectionModal } = require('./add-github-connection-modal');

export class GithubPage extends BasePage {

  constructor (page) {
    super(page)
    this.addConnectionButton = page.getByTestId('add-connection-button');
    this.connectionsTab = page.getByTestId('connections-tab');
    this.flowsTab = page.getByTestId('flows-tab');
    this.connectionRows = page.getByTestId('connection-row');
    this.flowRows = page.getByTestId('flow-row');
    this.firstConnectionButton = page.getByTestId('connections-no-results');
    this.firstFlowButton = page.getByTestId('flows-no-results');
    this.addConnectionModal = new AddGithubConnectionModal(page);
  }

  async goto () {
    await this.page.goto('/app/github/connections');
  }

  async openConnectionModal () {
    await this.addConnectionButton.click();
    await expect(this.addConnectionButton.modal).toBeVisible();
    return this.addConnectionModal;
  }

  async flowsVisible () {
    return this.page.url() === await this.flowsTab.getAttribute('href');
  }

  async connectionsVisible () {
    return this.page.url() === await this.connectionsTab.getAttribute('href');
  }

  async hasFlows () {
    if (!(await this.flowsVisible())) {
      await this.flowsTab.click();
      await expect(this.flowsTab).toBeVisible();
    }
    return await this.flowRows.count() > 0
  }

  async hasConnections () {
    if (!(await this.connectionsVisible())) {
      await this.connectionsTab.click();
      await expect(this.connectionsTab).toBeVisible();
    }
    return await this.connectionRows.count() > 0;
  }
}

/**
 *
 * @param {import('@playwright/test').Page} page
 */
export async function initGithubConnection (page) {
  // assumes already logged in
  const githubPage = new GithubPage(page);
  await githubPage.goto();
  const modal = await githubPage.openConnectionModal();
  await modal.inputForm();
  const popup = await modal.submit();
  await modal.handlePopup(popup);
}