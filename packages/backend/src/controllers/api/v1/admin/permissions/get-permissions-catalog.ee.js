import { renderObject } from '../../../../../helpers/renderer.js';
import permissionCatalog from '../../../../../helpers/permission-catalog.ee.js';

export default async (request, response) => {
  renderObject(response, permissionCatalog);
};
