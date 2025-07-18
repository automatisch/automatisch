export class TemplatesModal {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.modal = page.getByTestId('templates-dialog');
    this.templateRowLocator = page.getByTestId('template-row');
    this.templateRow = (templateName) =>
      this.templateRowLocator.filter({ hasText: templateName });
    this.templateButton = (templateName) =>
      this.templateRowLocator
        .filter({ hasText: templateName })
        .getByRole('button');
    this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    this.templateNameInput = page.getByTestId('template-name-input');
    this.createButton = page.getByTestId('create-button');
  }
}
