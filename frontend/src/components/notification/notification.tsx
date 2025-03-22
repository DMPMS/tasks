import { useEffect, useState } from "react";
import { useGlobalReducer } from "../../store/reducers/globalReducer/useGlobalReducer";
import { NotificationType } from "../../types/NotificationType";
import styles from "./notification.module.css";
import { NOTIFICATION_TIMEOUT } from "../../config/constants";

const Notification = () => {
  const { notification } = useGlobalReducer();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (notification) {
      const newNotification = {
        type: notification.type,
        message: notification.message,
      };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((_, index) => index !== 0));
      }, NOTIFICATION_TIMEOUT);
    }
  }, [notification]);

  const showNotification = (
    <div className={styles.container}>
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`${styles.notification} ${
            styles[notification.type] || styles.default
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );

  return {
    showNotification,
  };
};

export default Notification;
