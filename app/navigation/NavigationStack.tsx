import * as React from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import NavigationService, {navigationRef} from './NavigationService';

import {StatusBar} from 'react-native';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {
  authActionSelector,
  authStateSelector,
  noticeActionSelector,
  noticeStateSelector,
  settingActionSelector,
} from '../store';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import {useTheme} from 'react-native-paper';
import {Linking} from './LinkingConfiguration';
import {storage} from 'app/store/storage';
import i18n from 'app/i18n';
import SplashScreen from 'app/screens/Splash';

const Stack = createStackNavigator();

interface IProps {
  theme: Theme;
}

const NavigationStack: React.FC<IProps> = (props: IProps) => {
  const {theme} = props;
  const {colors}: any = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);

  const {token, fcmToken} = useStoreState(authStateSelector);
  const {
    getRefreshToken,
    getProfile,
    getWallets,
    setIsAutoLogin,
    saveDeviceToken,
  } = useStoreActions(authActionSelector);
  const {setLanguage, setNotification, setNotificationAds} = useStoreActions(
    settingActionSelector,
  );
  const {isRedirectNotice} = useStoreState(noticeStateSelector);
  const {setIsRedirectNotice} = useStoreActions(noticeActionSelector);

  React.useLayoutEffect(() => {
    _checkToken();
  }, []);

  React.useLayoutEffect(() => {
    if (isRedirectNotice) {
      _checkToken();
    }
  }, [isRedirectNotice]);

  React.useLayoutEffect(() => {
    if (token) {
      _handleLogin();
    }
  }, [token]);

  const _getRefreshToken = async () => {
    await getRefreshToken();
  };

  const _checkToken = async () => {
    setIsLoading(true);

    await _handleSettings();
    await _handleInstructions();
    
    setTimeout(async () => {
      setIsLoading(false);
      const isInstructions = await storage.getItem('isInstructions');
      if (!isInstructions) {
        NavigationService.navigate('InstructionsScreen');
      }
    }, 1000)
  };

  const _handleSettings = async () => {
    const languageStore = await storage.getItem('language');
    const notification = await storage.getItem('notification');
    const notificationAds = await storage.getItem('notificationAds');

    if (notification) {
      setNotification(true);
    } else {
      setNotification(false);
    }

    if (notificationAds) {
      setNotificationAds(true);
    } else {
      setNotificationAds(false);
    }

    if (!languageStore) {
      storage.setItem('language', 'kr');
      setLanguage('kr');
      i18n.changeLanguage('kr');
    } else {
      setLanguage(`${languageStore}`);
      i18n.changeLanguage(languageStore);
    }
  };

  const _handleInstructions = async () => {
    const isInstructions = await storage.getItem('isInstructions');
    if (!isInstructions) {
      NavigationService.navigate('InstructionsScreen');
    } else {
      await _handleAutoLogin();
    }
  };

  const _handleAutoLogin = async () => {
    const isAutoLogin = await storage.getItem('isAutoLogin');
    if (isAutoLogin) {
      await _getRefreshToken();
      const resProfile = await getProfile();
      if (resProfile) {
        await _handleLogin();
        !!fcmToken &&
          (await saveDeviceToken({
            fcm_token: `${fcmToken}`,
          }));
        setIsAutoLogin(true);
        if (isRedirectNotice) {
          setIsRedirectNotice(false);
          NavigationService.navigate('NotificationScreen');
        } else if (!resProfile?.data?.height || !resProfile?.data?.weight) {
          NavigationService.navigate('EditBodyInformationScreen', {
            isUpdateBodyInformation: true,
          });
        } else {
          NavigationService.navigate('GoRiceScreen');
        }
      } else {
        setIsAutoLogin(false);
        NavigationService.navigate('LoginScreen');
      }
    } else {
      setIsAutoLogin(false);
      NavigationService.navigate('LoginScreen');
    }
  };

  const _handleLogin = async () => {
    await getWallets();
  };

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer ref={navigationRef} theme={theme} linking={Linking}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        animated={true}
        backgroundColor={colors.white}
      />

      <Stack.Navigator headerMode="none">
        {token ? (
          <Stack.Screen name="TabStack" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;
