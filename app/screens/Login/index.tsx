import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  TextInput,
  Text,
  Dimensions,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import validator from 'validator';
import i18n from '../../i18n';
import styles from '../../styles';
import NavigationService from 'app/navigation/NavigationService';
import { useStoreActions, useStoreState } from 'easy-peasy';
import {
  authActionSelector,
  authStateSelector,
  modalActionSelector,
  noticeActionSelector,
  noticeStateSelector,
  shopActionSelector,
} from 'app/store';
import { useNavigation } from '@react-navigation/native';
import CheckBoxCustomTwo from 'app/components/CheckboxCustomTwo';
import { storage } from 'app/store/storage';
const LoginScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const accountIDRef: any = useRef();
  const passwordRef: any = useRef();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    login,
    setIsLoginError,
    setIsLoginSuccess,
    setIsAutoLogin,
    saveDeviceToken,
    getProfile,
  } = useStoreActions(authActionSelector);
  const { isLoginSuccess, isLoginError, isAutoLogin, fcmToken } =
    useStoreState(authStateSelector);
  const { getStatusFunctions } = useStoreActions(shopActionSelector);
  const [accountID, setAccountID] = useState('');
  const [isAccountID, setIsAccountID] = useState(false);
  const [password, setPassword] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const [isSaveID, setIsSaveID] = useState(true);
  const { setLoadingVisible } = useStoreActions(modalActionSelector);
  const { isRedirectNotice } = useStoreState(noticeStateSelector);
  const { setIsRedirectNotice } = useStoreActions(noticeActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'column',
          justifyContent: 'center',
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        inputBorder: {
          backgroundColor: colors.green_bland,
        },

        wrapperLoginBottom: {
          marginBottom: 34,
        },
        logo: {
          width: 151.68,
          height: 120,
          alignSelf: 'center',
        },
        inputAccountID: {
          fontSize: 14,
          borderColor: isAccountID ? colors.red : colors.input,
        },
        inputPassword: {
          fontSize: 14,
          marginTop: 23,
          borderColor: isPassword ? colors.red : colors.input,
        },
        checkbox: {
          paddingHorizontal: 1,
          marginLeft: 3,
          marginBottom: 2,
        },
        checkBoxRow: {
          flexDirection: 'row',
          marginTop: 20,
        },
        button: {
          backgroundColor: colors.black,
          marginBottom: 25,
        },
        register: {
          fontSize: 14,
          alignSelf: 'center',
          color: colors.hint,
        },
        iconSns: {
          width: 40,
          height: 40,
        },
        wrapperLoginSns: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginHorizontal: 33,
          marginTop: 18,
        },
        wrapperTextError: {
          height: 32,
        },
        wrapperBoxLogin: {
          marginTop: Dimensions.get('window').height / 2 - 480,
        },
        Title: {
          fontSize: 36,
          textAlign: 'center',
          fontWeight: 'bold',
        },
        textError: {
          textAlign: 'center',
          color: colors.red,
          marginTop: 8,
        },
      }),
    [isAccountID, isPassword],
  );
  useEffect(() => {
    return navigation.addListener('focus', async () => {
      setIsLoading(true);
      const accountIDStorage = await storage.getItem('accountID');
      setAccountID(accountIDStorage || '');
      setTimeout(() => {
        setIsLoading(false);
      });
    });
  }, [navigation]);

  useEffect(() => {
    if (isLoginSuccess) {
      _saveDeviceToken();
      if (isRedirectNotice) {
        setIsRedirectNotice(false);
        NavigationService.navigate('NotificationScreen');
      }
    }
  }, [isLoginSuccess]);
  useEffect(() => {
    if (isLoginError) {
      if (!isSaveID) {
        setAccountID('');
        setPassword('');
      }

      setIsAccountID(true);
      setIsPassword(true);
    }
  }, [isLoginError]);

  useEffect(() => {
    _getDataFunction()
  })

  const _getDataFunction = async () => {
    await getStatusFunctions();
  }
  const _saveDeviceToken = async () => {
    setLoadingVisible(true);
    setIsLoginSuccess(false);
    isSaveID && storage.setItem('accountID', accountID);
    const resProfile = await getProfile();
    if (resProfile) {
      if (!resProfile?.data?.height || !resProfile?.data?.weight) {
        NavigationService.navigate('EditBodyInformationScreen', {
          isUpdateBodyInformation: true,
        });
      } else {
        NavigationService.navigate('GoRiceScreen');
      }
    }
    !!fcmToken &&
      (await saveDeviceToken({
        fcm_token: `${fcmToken}`,
      }));
    setLoadingVisible(false);
  };
  const _redirectRegister = () => {
    NavigationService.navigate('TermsOfServiceScreen');
  };
  const _handleNextEmail = () => {
    passwordRef?.current?.focus();
  };
  const _login = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      if (!validator.isEmail(accountID)) {
        setIsAccountID(true);
      }
      if (!password) {
        setIsPassword(true);
      }
      if (password && validator.isEmail(accountID)) {
        await login({
          email: accountID,
          password,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log('login error:', error);
    }
  };
  const _changeAccountID = (text: string) => {
    setIsLoginError(false);
    setIsAccountID(false);
    setIsPassword(false);
    setAccountID(text);
  };
  const _changePassword = (text: string) => {
    setIsLoginError(false);
    setIsPassword(false);
    setIsAccountID(false);
    setPassword(text);
  };
  const _redirectInfoAccount = () => {
    NavigationService.navigate('QueryAccountInformationScreen');
  };
  const _handleSaveIDAccount = () => {
    isSaveID && storage.removeItem('accountID');
    setIsSaveID(!isSaveID);
  };
  const _handleError = () => (
    <Text style={[styles.text12Regular, localStyles.textError]}>
      {i18n.t('login.error_login')}
    </Text>
  );
  const _handleNotificationAccountID = () => (
    <>
      {isAccountID && (
        <Text style={[styles.text12Regular, localStyles.textError]}>
          {i18n.t('login.error_login')}
        </Text>
      )}
    </>
  );

  return (
    <View style={[styles.container, localStyles.container]}>
      <StatusBar
        barStyle="dark-content"
        animated={true}
        backgroundColor={colors.splash}
      />
      <View style={[localStyles.wrapperBoxLogin]}>
        <View>
          <Image
            source={require('../../assets/images/logo.png')}
            style={localStyles.logo}
            resizeMode="cover"
          />
          <View style={[localStyles.wrapperTextError]}>
            {isLoginError ? (
              <>{_handleError()}</>
            ) : (
              <>{_handleNotificationAccountID()}</>
            )}
          </View>
          <View>
            <TextInput
              ref={accountIDRef}
              numberOfLines={1}
              returnKeyType="next"
              placeholder={i18n.t('login.email')}
              placeholderTextColor={colors.hint}
              style={[
                styles.inputRegister,
                localStyles.inputAccountID,
                localStyles.inputBorder,
              ]}
              keyboardType="email-address"
              onSubmitEditing={_handleNextEmail}
              onChangeText={_changeAccountID}
              value={accountID}
              secureTextEntry={false}
              autoCapitalize="none"
              autoFocus={false}
            />

            <TextInput
              ref={passwordRef}
              numberOfLines={1}
              returnKeyType="done"
              placeholder={i18n.t('login.password')}
              placeholderTextColor={colors.hint}
              style={[
                styles.inputRegister,
                localStyles.inputPassword,
                localStyles.inputBorder,
              ]}
              keyboardType="default"
              onSubmitEditing={_login}
              onChangeText={_changePassword}
              value={password}
              secureTextEntry={true}
              autoCapitalize="none"
              autoFocus={false}
            />
            <View style={[localStyles.checkBoxRow]}>
              <CheckBoxCustomTwo
                textContent={i18n.t('login.save_id')}
                value={isSaveID}
                changeValue={_handleSaveIDAccount}
                space={10}
                isReverse={false}
                style={[localStyles.checkbox, { paddingRight: 32 }]}
              />
              <CheckBoxCustomTwo
                textContent={i18n.t('login.auto_login')}
                value={isAutoLogin}
                changeValue={() => setIsAutoLogin(!isAutoLogin)}
                space={10}
                isReverse={false}
                style={localStyles.checkbox}
              />
            </View>
            <View style={[localStyles.wrapperTextError]} />
            <Button
              mode="contained"
              onPress={_login}
              style={[styles.button, localStyles.button]}
              uppercase={true}
              labelStyle={[styles.labelButton]}
              disabled={isLoading}
              loading={false}>
              {i18n.t('login.login')}
            </Button>
            <View style={[styles.row, { justifyContent: 'center' }]}>
              <TouchableOpacity onPress={_redirectRegister}>
                <Text style={[styles.text12Regular, localStyles.register]}>
                  {i18n.t('login.register')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={_redirectInfoAccount}>
                <Text style={[styles.text12Regular, localStyles.register]}>
                  {i18n.t('login.info_account')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default LoginScreen;
