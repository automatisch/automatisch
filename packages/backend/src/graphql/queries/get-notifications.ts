import axios from '../../helpers/axios-with-proxy';

const NOTIFICATIONS_URL = 'https://notifications.automatisch.io/notifications.json';

const getNotifications = async () => {
  try {
    const { data: notifications = [] } = await axios.get(NOTIFICATIONS_URL);

    return notifications;
  } catch (err) {
    return [];
  }
};

export default getNotifications;
