import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export default class FCMService {
  static initPushNotifications = (onNotification = () => {
    console.log('getFcmToken');
  }) => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification
        onNotification(notification);
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      onNotification(remoteMessage, 'background');
    });

    PushNotification.createChannel(
      {
        channelId: 'fcm_fallback_notification_channel', // (required)
        channelName: 'fcm channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        // importance: 4, // (optional) default: 4. Int value of the Android notification importance
        // vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  static checkAndAskPermission = (callback = () => {
    console.log('getFcmToken');
  }) => {
    messaging()
      .hasPermission()
      .then(r => {
        console.log('permission fcm', r);
        if (r) {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(e => {
        console.log('permission fcm', e);
        callback(false);
      });
  };

  static onMessage = (callback = () => {
    console.log('getFcmToken');
  }) => {
    messaging().onMessage(remoteMessage => {
      callback(remoteMessage);
    });
  };

  static getFcmToken = async (callback = token => {
    console.log('getFcmToken');
  }) => {
    try {
      messaging()
        .getToken()
        .then(token => {
          console.log({ token });
          if (token) {
            callback(token);
          }
        });
    } catch (error) {
      console.log('error>>', error);
    }
  };

  static setBadgeIos(number) {
    try {
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(Number(number));
      }
    } catch (error) {}
  }

  static subscribeToTopic = topic => {
    return messaging().subscribeToTopic(topic);
  };

  static requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission({
      alert: true,
      sound: true,
      badge: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  };
}
