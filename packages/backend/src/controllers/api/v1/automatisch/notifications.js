import { renderObject } from '../../../../helpers/renderer.js';
import axios from '../../../../helpers/axios-with-proxy.js';
import logger from '../../../../helpers/logger.js';

const NOTIFICATIONS_URL =
  'https://notifications.automatisch.io/notifications.json';

export default async (request, response) => {
  let notifications = [];

  try {
    const response = await axios.get(NOTIFICATIONS_URL);
    notifications = response.data;
  } catch (error) {
    logger.error('Error fetching notifications API endpoint!', error);
  }

  renderObject(response, notifications);
};
