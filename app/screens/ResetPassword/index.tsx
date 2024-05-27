import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TextInput,
  Dimensions,
  Keyboard,
  Platform,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import styles from '../../styles';
import i18n from 'app/i18n';
import {
  authActionSelector,
  authStateSelector,
  modalActionSelector,
} from 'app/store';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useNavigation, useRoute } from '@react-navigation/native';
import { validatePassword } from 'app/utils/validation';
import { ScrollView } from 'react-native-gesture-handler';

const ResetPasswordScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [nowPassword, setNowPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const {
    setIsResetPasswordSuccess,
    setIsChangePasswordSuccessVisible,
    setIsPasswordErrorVisible,
  } = useStoreActions(modalActionSelector);
  const { user, isUpdatePassword } = useStoreState(authStateSelector);
  const { updatePassword, changePassword, setIsUpdatePassword } =
    useStoreActions(authActionSelector);
  const [errorCurrentPass, setErrorCurrentPass] = useState(false);
  const [errorNewPass, setErrorNewPass] = useState(false);
  const [errorConfirmNewPass, setErrorConfirmNewPass] = useState(false);
  const [errorChangePass, setErrorChangePass] = useState(false);
  const [errorNowPassFormat, setErrorNowPassFormat] = useState(false);
  const [errorNewPassFormat, setErrorNewPassFormat] = useState(false);
  const [errorNewPassword, setErrorNewPassword] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'column',
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 5,
          marginBottom: 30,
          backgroundColor: colors.background,
        },
        wrapperAgreeAll: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 14,
        },
        checkbox: {
          justifyContent: 'space-between',
          paddingVertical: 17,
        },
        textLabel: {
          fontWeight: '400',
          marginBottom: 10,
          color: colors.btn_black,
        },
        button: {
          marginTop: 22,
          backgroundColor: colors.gold_500,
        },
        passWordDefault: {
          marginTop: 10,
          color: colors.royal_blue,
          lineHeight: 14,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: Platform.OS == 'ios' ? 10.5 : 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
        labelCertificate: {
          letterSpacing: 0.5,
          paddingVertical: 1.5,
          textTransform: 'capitalize',
        },
        input: {
          paddingHorizontal: 11,
          fontStyle: 'normal',
          lineHeight: 17,
          paddingVertical: Platform.OS == 'ios' ? 11.5 : 6,
          color: colors.btn_black,
        },
        buttonCertificate: {
          borderRadius: 10,
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
        styleFlatList: {},
        flatList: {},
        menu: {},
        contentStyleMenu: {},
        wrapperItem: {
          width: Dimensions.get('screen').width - 32,
          padding: 10,
        },
        iconDropdown: {
          width: 14,
          height: 10,
        },
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      });
    });
  }, [navigation]);

  useEffect(() => {
    if (isUpdatePassword == 2) {
      setIsUpdatePassword(1);
      !route?.params?.isChangePassword
        ? setIsResetPasswordSuccess(true)
        : setIsChangePasswordSuccessVisible(true);
    } else if (isUpdatePassword == 3) {
      setIsUpdatePassword(1);
      setIsPasswordErrorVisible(true);
    }
  }, [isUpdatePassword]);

  const _resetPassword = async () => {
    if (
      nowPassword &&
      newPassword &&
      confirmNewPassword &&
      nowPassword !== newPassword &&
      newPassword == confirmNewPassword &&
      validatePassword(nowPassword) &&
      validatePassword(newPassword)
    ) {
      Keyboard.dismiss();
      await updatePassword({
        email: user?.email,
        password: newPassword,
        password_confirmation: confirmNewPassword,
        password_current: nowPassword,
      });
    } else {
      _handleCheckError();
    }
  };
  const _forgotPassword = async () => {
    if (
      newPassword &&
      confirmNewPassword &&
      newPassword == confirmNewPassword &&
      validatePassword(newPassword)
    ) {
      Keyboard.dismiss();
      await changePassword({
        email: route?.params?.email,
        password: newPassword,
        password_confirmation: confirmNewPassword,
        full_name: route?.params?.fullName,
      });
    } else {
      _handleCheckError();
    }
  };

  const _checkResetPassword = () => {
    if (route?.params?.isChangePassword) {
      _resetPassword();
    } else {
      _forgotPassword();
    }
  };

  const _handleCheckError = () => {
    if (!validatePassword(nowPassword)) {
      setErrorNowPassFormat(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorNewPassFormat(true);
      return;
    }

    if (!nowPassword) {
      setErrorCurrentPass(true);
      return;
    }
    if (!newPassword) {
      setErrorNewPass(true);
      return;
    }
    if (!confirmNewPassword) {
      setErrorConfirmNewPass(true);
      return;
    }
    if (
      newPassword &&
      confirmNewPassword &&
      newPassword != confirmNewPassword
    ) {
      setErrorChangePass(true);
      return;
    }
    if (nowPassword == newPassword) {
      setErrorNewPassword(true);
    }
  };

  return (
    <ScrollView style={[styles.container, localStyles.container]}>
      <StatusBar barStyle="dark-content" animated={true} />
      {route?.params?.isInformationSuccess ? (
        <View
          style={{
            marginTop: 50,
            marginBottom: 36,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text
            style={[styles.title, { marginBottom: 14, fontWeight: 'bold' }]}>
            {i18n.t('reset_password.reset_password')}
          </Text>
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.text14Regular, { color: colors.btn_black }]}>
              {i18n.t('reset_password.information_confirm_success')}
            </Text>
            <Text style={[styles.text14Regular, { color: colors.btn_black }]}>
              {i18n.t('reset_password.reset_password_now')}
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 19 }}>
          <View>
            <Text style={[styles.text14Medium, localStyles.textLabel]}>
              {i18n.t('reset_password.now_password')}
            </Text>
            <TextInput
              numberOfLines={1}
              returnKeyType="next"
              placeholder={i18n.t('reset_password.place_holder_now_password')}
              placeholderTextColor={colors.hint}
              style={[
                styles.input,
                styles.text14Regular,
                localStyles.input,
                {
                  borderColor: errorCurrentPass
                    ? colors.red
                    : colors.border_input_gray,
                },
              ]}
              keyboardType="default"
              onChangeText={(text: string) => {
                setNowPassword(text);
                setErrorCurrentPass(false);
                setErrorNowPassFormat(false);
              }}
              value={nowPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              autoFocus={false}
            />
          </View>
          {errorCurrentPass && (
            <Text
              style={[
                styles.text14Regular,
                { color: colors.red, marginTop: 10 },
              ]}>
              {i18n.t('register.error_enter')}
            </Text>
          )}
          {errorNowPassFormat && (
            <Text
              style={[
                styles.text14Regular,
                { color: colors.red, marginTop: 10 },
              ]}>
              {i18n.t('register.validate_text')}
            </Text>
          )}
        </View>
      )}
      <View style={{ marginTop: 17 }}>
        <Text style={[styles.text14Medium, localStyles.textLabel]}>
          {i18n.t('reset_password.new_password')}
        </Text>
        <TextInput
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t('reset_password.place_holder_new_password')}
          placeholderTextColor={colors.hint}
          style={[
            styles.input,
            styles.text14Regular,
            localStyles.input,
            {
              borderColor: errorNewPass ? colors.red : colors.border_input_gray,
            },
          ]}
          keyboardType="default"
          onChangeText={(text: string) => {
            setNewPassword(text);
            setErrorNewPass(false);
            setErrorChangePass(false);
            setErrorNewPassFormat(false);
            setErrorNewPassword(false);
          }}
          value={newPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoFocus={false}
        />
        {route?.params?.isInformationSuccess &&
        !errorNewPass &&
        !errorChangePass ? (
          <Text
            style={[
              styles.text12Regular,
              {
                lineHeight: 14,
                color: colors.blue,
                marginTop: 10,
                marginBottom: 6,
              },
            ]}>
            {i18n.t('reset_password.password_default')}
          </Text>
        ) : (
          <>
            {errorNewPass && (
              <Text
                style={[
                  styles.text14Regular,
                  { color: colors.red, marginTop: 10 },
                ]}>
                {i18n.t('register.error_enter')}
              </Text>
            )}
            {!route?.params?.isInformationSuccess && errorNewPassword && (
              <Text
                style={[
                  styles.text14Regular,
                  { color: colors.red, marginTop: 10 },
                ]}>
                {i18n.t(
                  'register.error_new_password_the_same_current_password',
                )}
              </Text>
            )}
          </>
        )}
        {errorNewPassFormat && (
          <Text
            style={[
              styles.text14Regular,
              { color: colors.red, marginTop: 10 },
            ]}>
            {i18n.t('register.validate_text')}
          </Text>
        )}
      </View>
      <View style={{ marginTop: 17 }}>
        <Text style={[styles.text14Medium, localStyles.textLabel]}>
          {i18n.t('reset_password.confirm_new_password')}
        </Text>
        <TextInput
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t(
            'reset_password.place_holder_confirm_new_password',
          )}
          placeholderTextColor={colors.hint}
          style={[
            styles.input,
            styles.text14Regular,
            localStyles.input,
            {
              borderColor:
                errorConfirmNewPass || errorChangePass
                  ? colors.red
                  : colors.border_input_gray,
            },
          ]}
          keyboardType="default"
          onChangeText={(text: string) => {
            setConfirmNewPassword(text);
            setErrorConfirmNewPass(false);
            setErrorChangePass(false);
          }}
          value={confirmNewPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoFocus={false}
        />
        {errorConfirmNewPass && (
          <Text
            style={[
              styles.text14Regular,
              { color: colors.red, marginTop: 10 },
            ]}>
            {i18n.t('register.error_enter')}
          </Text>
        )}
        {errorChangePass && (
          <Text
            style={[
              styles.text14Regular,
              { color: colors.red, marginTop: 10 },
            ]}>
            {i18n.t(
              'reset_password.new_password_must_be_same_as_confirm_new_password',
            )}
          </Text>
        )}
      </View>
      <Button
        mode="contained"
        onPress={_checkResetPassword}
        style={[styles.button, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={isLoading}
        loading={false}>
        {i18n.t('reset_password.reset_password')}
      </Button>
    </ScrollView>
  );
};

export default ResetPasswordScreen;
