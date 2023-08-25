const path = require('node:path');
const { AuthenticatedPage } = require('./authenticated-page');

export class ExecutionsPage extends AuthenticatedPage {
  screenshotPath = '/executions';
}
