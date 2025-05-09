import { renderObject } from '../../../../../helpers/renderer.js';
import axios from '../../../../../helpers/axios-with-proxy.js';
import logger from '../../../../../helpers/logger.js';
import appConfig from '../../../../../config/app.js';

export default async (request, response) => {
  const AUTOMATISCH_NOTIFICATIONS_URL =
    'https://notifications.automatisch.io/notifications.json';

  const MATION_NOTIFICATIONS_URL =
    'https://notifications.mation.work/notifications.json';

  const NOTIFICATIONS_URL = appConfig.isMation
    ? MATION_NOTIFICATIONS_URL
    : AUTOMATISCH_NOTIFICATIONS_URL;

  let notifications = [];

  try {
    const response = await axios.get(NOTIFICATIONS_URL);

    notifications = response.data;
  } catch (error) {
    logger.error('Error fetching notifications API endpoint!', error);
  }

  renderObject(response, notifications);
};
