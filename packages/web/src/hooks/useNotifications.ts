import * as React from 'react';
import appConfig from 'config/app';

interface INotification {
  name: string;
  createdAt: string;
  documentationUrl: string;
  description: string;
}

export default function useNotifications(): INotification[] {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);

  React.useEffect(() => {
    fetch(`${appConfig.notificationsUrl}/notifications.json`)
      .then((response) => response.json())
      .then((notifications) => {
        if (Array.isArray(notifications) && notifications.length) {
          setNotifications(notifications);
        }
      })
      .catch(console.error);
  }, []);

  return notifications;
}
