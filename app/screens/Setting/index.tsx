import i18n from 'app/i18n';
import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, Text, ScrollView, View, AppState, Platform, Linking } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import styles from '../../styles';
import NavigationService from 'app/navigation/NavigationService';
import { useStoreActions, useStoreState } from 'easy-peasy';
import {
  authActionSelector,
  authStateSelector,
  modalActionSelector,
  settingActionSelector,
  settingStateSelector,
} from 'app/store';
import { storage } from 'app/store/storage';
import { useNavigation } from '@react-navigation/native';
import CheckboxCustomThree from 'app/components/CheckboxCustomThree';
import CheckBoxCustomTwo from 'app/components/CheckboxCustomTwo';
import firebase from '@react-native-firebase/messaging';
import { checkNotifications } from 'react-native-permissions';

const SettingScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLanguageKorea, setIsLanguageKorea] = useState(false);
  const [isLanguageEnglish, setIsLanguageEnglish] = useState(false);
  const [isLoginBase, setIsLoginBase] = useState(false);
  const [isLoginAuto, setIsLoginAuto] = useState(false);
  const [isNoNotification, setIsNoNotification] = useState(false);
  const [isNotificationPush, setIsNotificationPush] = useState(false);
  const [appState, setAppState] = useState('');

  const { setLanguage, setNotification } = useStoreActions(
    settingActionSelector,
  );
  const { language } =
    useStoreState(settingStateSelector);
  const { setIsAutoLogin } = useStoreActions(authActionSelector);
  const { isAutoLogin } = useStoreState(authStateSelector);
  const { setLoadingVisible } = useStoreActions(modalActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
          paddingTop: 15,
        },
        labelBox: {
          color: colors.btn_black,
        },
        button: {
          backgroundColor: colors.btn_black,
          marginTop: 41,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: 8,
        },
        textLabel: {
          fontWeight: '400',
          lineHeight: 19,
          marginBottom: 14,
          color: colors.btn_black,
        },
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      _checkNotificationStatus();
      setTimeout(() => {
        setIsLoading(false);
      });
    });
  }, [navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const _handleAppStateChange = (nextAppState: any) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      _checkNotificationStatus();
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    switch (language) {
      case 'kr': {
        setIsLanguageKorea(true);
        break;
      }
      case 'en': {
        setIsLanguageEnglish(true);
        break;
      }
      default: {
        setIsLanguageKorea(true);
        break;
      }
    }

    if (isAutoLogin) {
      _handleChooseLoginAuto();
    } else {
      _handleChooseLoginBase();
    }
  }, []);

  const _checkNotificationStatus = async () => {
    if (Platform.OS === 'ios') {
      const messaging = firebase();
      const authStatus = await messaging.hasPermission();
      _checkNotification(authStatus);
    } else {
      checkNotifications().then(({ status }) => {
        _checkNotification(status === 'granted');
      });
    }
  };

  const _checkNotification = (value: any) => {
    if (value) {
      setNotification(true);
      setIsNoNotification(false);
      setIsNotificationPush(true);
      storage.setItem('notification', true);
    } else {
      setNotification(false);
      setIsNoNotification(true);
      setIsNotificationPush(false);
      storage.removeItem('notification');
    }
  }

  const _handleChooseLanguageKorea = () => {
    setIsLanguageKorea(true);
    setIsLanguageEnglish(false);
  };

  const _handleChooseLanguageEnglish = async () => {
    setIsLanguageKorea(false);
    setIsLanguageEnglish(true);
  };

  const _handleChooseLoginBase = () => {
    setIsLoginBase(true);
    setIsLoginAuto(false);
  };

  const _handleChooseLoginAuto = () => {
    setIsLoginBase(false);
    setIsLoginAuto(true);
  };

  const _handleChooseNotificationPush = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings://');
    } else {
      Linking.openSettings();
    }
  };

  const _save = () => {
    if (isLanguageKorea) {
      setLanguage('kr');
      storage.setItem('language', 'kr');
      i18n.changeLanguage('kr');
    } else if (isLanguageEnglish) {
      setLanguage('en');
      storage.setItem('language', 'en');
      i18n.changeLanguage('en');
    } else {
      setLanguage('vi');
      storage.setItem('language', 'vi');
      i18n.changeLanguage('vi');
    }

    setIsAutoLogin(isLoginBase ? false : true);
    isLoginBase ? storage.removeItem('isAutoLogin') : storage.setItem('isAutoLogin', true);

    setLoadingVisible(true);
    NavigationService.navigate('ProfileScreen');
    setTimeout(() => {
      NavigationService.navigate('ProfileScreen');
    });
    setTimeout(() => {
      setLoadingVisible(false);
    }, 1000);
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={isLoading}
        backgroundColor={colors.splash}
      />
      <Text style={[styles.text16Bold, localStyles.textLabel]}>
        {i18n.t('setting.language')}
      </Text>
      <View style={{ marginBottom: 27 }}>
        <CheckboxCustomThree
          textContent={i18n.t('setting.korea')}
          value={isLanguageKorea}
          changeValue={_handleChooseLanguageKorea}
          space={11}
          isReverse={false}
          labelStyle={[localStyles.labelBox]}
          style={{ marginBottom: 10 }}
        />
        <CheckboxCustomThree
          textContent={i18n.t('setting.english')}
          value={isLanguageEnglish}
          changeValue={_handleChooseLanguageEnglish}
          space={11}
          isReverse={false}
          labelStyle={[localStyles.labelBox]}
        />
      </View>
      <Text style={[styles.text16Bold, localStyles.textLabel]}>
        {i18n.t('setting.login')}
      </Text>
      <View style={{ marginBottom: 27 }}>
        <CheckboxCustomThree
          textContent={i18n.t('setting.login_base')}
          value={isLoginBase}
          changeValue={_handleChooseLoginBase}
          space={11}
          isReverse={false}
          labelStyle={[localStyles.labelBox]}
          style={{ marginBottom: 10 }}
        />
        <CheckboxCustomThree
          textContent={i18n.t('setting.login_auto')}
          value={isLoginAuto}
          changeValue={_handleChooseLoginAuto}
          space={11}
          isReverse={false}
          labelStyle={[localStyles.labelBox]}
        />
      </View>
      <Text style={[styles.text16Bold, localStyles.textLabel]}>
        {i18n.t('setting.notification')}
      </Text>
      <View style={{ marginBottom: 28 }}>
        <CheckboxCustomThree
          textContent={i18n.t('setting.no_setting')}
          value={isNoNotification}
          changeValue={_handleChooseNotificationPush}
          space={11}
          isReverse={false}
          labelStyle={[localStyles.labelBox]}
          style={{ marginBottom: 10 }}
        />
        <CheckboxCustomThree
          textContent={i18n.t('setting.notification_setting')}
          value={isNotificationPush}
          changeValue={_handleChooseNotificationPush}
          space={11}
          isReverse={false}
          labelStyle={[localStyles.labelBox]}
        />
      </View>
      <View>
        <CheckBoxCustomTwo
          textContent={i18n.t('setting.notification_ads')}
          value={isNotificationPush}
          space={11}
          isReverse={false}
          labelStyle={[
            localStyles.labelBox,
            styles.text14Regular,
            { color: colors.hint },
          ]}
        />
      </View>
      <Button
        onPress={_save}
        mode="contained"
        style={[styles.button, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}>
        {i18n.t('setting.save')}
      </Button>
    </ScrollView>
  );
};

export default SettingScreen;
