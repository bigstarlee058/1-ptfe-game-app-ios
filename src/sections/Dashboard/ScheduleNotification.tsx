// NotificationHandler.tsx
import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

interface NotificationHandlerProps {
  streaks: number;
  scheduleForTomorrow: boolean;
  message: string;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({ streaks, scheduleForTomorrow, message }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Request notification permissions ONCE on mount
  useEffect(() => {
    const requestPermission = async () => {
      // const { status } = await Notifications.requestPermissionsAsync();
      setHasPermission(true);
      // setHasPermission(status === 'granted');
    };

    requestPermission();
  }, []);

  // Only schedule notification if we have permission and valid streak
  useEffect(() => {
    if (hasPermission && streaks > 0) {
      scheduleNotification(scheduleForTomorrow);
    }
  }, [hasPermission, streaks, scheduleForTomorrow]);

  const scheduleNotification = async (isTomorrow: boolean) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const triggerDate = new Date();
    triggerDate.setHours(7); // 7 AM
    triggerDate.setMinutes(0);
    triggerDate.setSeconds(0);
    triggerDate.setMilliseconds(0);

    if (isTomorrow || triggerDate < new Date()) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Streak Reminder!',
        body: message,
        sound: 'default',
      },
      trigger: {
        date: triggerDate,
      },
    });
  };

  return null;
};

export default NotificationHandler;