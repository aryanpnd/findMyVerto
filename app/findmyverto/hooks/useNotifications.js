import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useNotifications() {
  // Helper function to safely store AsyncStorage items with error handling
  const setAsyncStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item in AsyncStorage: ${key}`, error);
    }
  };

  // Helper function to safely get AsyncStorage items with error handling
  const getAsyncStorage = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from AsyncStorage: ${key}`, error);
      return null;
    }
  };

  // Function to request notification permissions
  const requestPermissions = async () => {
    console.log('inside the hook: Requesting permissions');
    // Create a notification channel on Android to trigger permission prompt
    if (Platform.OS === 'android') {
      console.log('Creating notification channel');
      
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      }).then(() => {
        console.log('Notification channel created');
      }).catch((error) => {
        console.error('Error creating notification channel:', error);
      });
    }

    // Check current permission status
    console.log('Checking notification permissions');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission is not granted, request it
    if (existingStatus !== 'granted') {
      console.log('Requesting notification permissions');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Handle the case where permission is not granted
    if (finalStatus !== 'granted') {
      console.error('Notification permission not granted');
    }
  };

  // Register background task
  const registerTask = async (name, content, time) => {
    try {
      if (await TaskManager.isTaskRegisteredAsync(name)) {
        console.log(`Task ${name} already registered.`);
        return;
      }

      TaskManager.defineTask(name, async () => {
        console.log(`Task ${name} triggered`);
        const currentTime = new Date();
        const notificationTriggerTime = new Date();
        notificationTriggerTime.setHours(time.hour);
        notificationTriggerTime.setMinutes(time.minute);
        notificationTriggerTime.setSeconds(0);

        // If scheduled time is in the past, schedule for the next day
        if (notificationTriggerTime <= currentTime) {
          notificationTriggerTime.setDate(notificationTriggerTime.getDate() + 1);
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            ...content,
            priority: 'max', // Set notification priority to max
          },
          trigger: {
            hour: notificationTriggerTime.getHours(),
            minute: notificationTriggerTime.getMinutes(),
            repeats: true,
          },
        });

        await setAsyncStorage(`notificationId_${name}`, notificationId);
        console.log(`Notification scheduled with ID: ${notificationId}`);
      });

      await TaskManager.registerTaskAsync(name); // Await task registration properly
      console.log(`Task ${name} registered.`);
    } catch (error) {
      console.error('Error registering task:', error);
    }
  };

  // Schedule notification
  const scheduleNotification = async (name, content, time) => {
    try {
      const currentTime = new Date();
      const notificationTriggerTime = new Date();
      notificationTriggerTime.setHours(time.hour);
      notificationTriggerTime.setMinutes(time.minute);
      notificationTriggerTime.setSeconds(0);

      // If scheduled time is in the past, schedule for the next day
      if (notificationTriggerTime <= currentTime) {
        notificationTriggerTime.setDate(notificationTriggerTime.getDate() + 1);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          ...content,
          priority: 'max', // Set notification priority to max
        },
        trigger: {
          hour: notificationTriggerTime.getHours(),
          minute: notificationTriggerTime.getMinutes(),
          repeats: true,
        },
      });

      await setAsyncStorage(`notificationId_${name}`, notificationId);
      console.log(`Notification scheduled with ID: ${notificationId}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // Set notification
  const setNotification = async (taskName, content, time) => {
    console.log('inside the hook: Setting notification');
    if (!taskName) {
      throw new Error('A unique task name must be provided to useNotifications.');
    }

    await requestPermissions(); // Request notification permissions
    // await registerTask(taskName, content, time);
    // await scheduleNotification(taskName, content, time);
  };

  // Remove notification
  const removeNotification = async (name) => {
    try {
      // Unregister task
      if (await TaskManager.isTaskRegisteredAsync(name)) {
        await TaskManager.unregisterTaskAsync(name);
        console.log(`Task ${name} unregistered.`);
      }

      // Cancel associated notification
      const notificationId = await getAsyncStorage(`notificationId_${name}`);
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        await AsyncStorage.removeItem(`notificationId_${name}`);
        console.log(`Notification with ID ${notificationId} canceled.`);
      }
    } catch (error) {
      console.error(`Error removing task ${name} or notification:`, error);
    }
  };

  // Initialize notifications on component mount
  useEffect(() => {
    const initializeNotifications = async () => {
      await requestPermissions();
    };

    initializeNotifications();
  }, []);

  return {
    setNotification, // Set a new notification
    removeNotification, // Remove a notification
  };
}
