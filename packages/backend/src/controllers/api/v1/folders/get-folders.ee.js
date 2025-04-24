import { renderObject } from '../../../../helpers/renderer.js';
import Folder from '../../../../models/folder.js';

export default async (request, response) => {
  const folders = await Folder.query().orderBy('name', 'asc');

  renderObject(response, folders);
};
