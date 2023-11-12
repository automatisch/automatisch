const { AdminCreateRolePage } = require('./create-role-page')

export class AdminEditRolePage extends AdminCreateRolePage {
  constructor (page) {
    super(page);
    delete this.createButton;
    this.updateButton = page.getByTestId('update-button');
    this.pageTitle = page.getByTestId('edit-role-title');
  }
}