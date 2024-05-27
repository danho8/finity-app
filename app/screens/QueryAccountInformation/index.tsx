import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import styles from '../../styles';
import i18n from 'app/i18n';
import validator from 'validator';
import NavigationService from 'app/navigation/NavigationService';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { authActionSelector, authStateSelector } from 'app/store';
import { useNavigation } from '@react-navigation/native';

const QueryAccountInformationScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();
  const otpRef = useRef();
  const emailRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [isLoadingConfirmOtp, setIsLoadingConfirmOtp] = useState(false);
  const [idEmail, setIdEmail] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nameChangePass, setNameChangePass] = useState('');
  const [isCheckSendOtp, setIsCheckSendOtp] = useState(1);
  const [isCheckOtpSuccess, setIsCheckOtpSuccess] = useState(1);
  const [countDown, setCountDown] = useState(300);
  const {
    emailVerification,
    setIsEmailVerification,
    confirmEmail,
    setIsConfirmEmail,
  } = useStoreActions(authActionSelector);
  const { isEmailVerification, isConfirmEmail } =
    useStoreState(authStateSelector);
  const { getFindAccount, setIsGetFindAccount } =
    useStoreActions(authActionSelector);
  const { isFindAccount } = useStoreState(authStateSelector);
  const [errorNameSearch, setErrorNameSearch] = useState(false);
  const [errorEmailSearch, setErrorEmailSearch] = useState(false);
  const [errorEmailReset, setErrorEmailReset] = useState(false);
  const [errorNameReset, setErrorNameReset] = useState(false);

  const keyboardVerticalOffset = Platform.OS == 'ios' ? 85 : 0;

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'column',
          flexGrow: 1,
          paddingBottom: 5,
          backgroundColor: colors.background,
          paddingTop: 16,
        },
        containerPadding: {
          paddingHorizontal: 16,
        },
        wrapperAgreeAll: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 14,
        },
        textLabel: {
          fontWeight: '400',
          marginBottom: 10,
        },
        textContent: {
          width: Dimensions.get('screen').width,
          lineHeight: 24,
          paddingBottom: 9,
        },
        checkbox: {
          justifyContent: 'space-between',
          paddingVertical: 17,
        },
        button: {
          backgroundColor: colors.gold_500,
          marginTop: 24,
          marginBottom: 54,
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
          fontSize: 14,
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 17,
          marginVertical: 0,
          paddingVertical: Platform.OS == 'ios' ? 11.25 : 9,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
        input: {
          paddingHorizontal: 11,
          paddingVertical: Platform.OS == 'ios' ? 11.5 : 6,
          fontStyle: 'normal',
          lineHeight: 17,
          borderColor: colors.border_input_gray,
          color: colors.btn_black,
        },
        buttonCertificate: {
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
          height: 14,
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
    if (countDown > 0 && isCheckSendOtp != 1 && isCheckOtpSuccess != 3) {
      const timeCountDown = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);

      return () => {
        clearInterval(timeCountDown);
      };
    }
  }, [countDown, isCheckSendOtp]);

  useEffect(() => {
    setCountDown(300);
  }, [isCheckSendOtp]);

  useEffect(() => {
    if (isCheckOtpSuccess == 3) {
      setCertificateNumber('');
    }
  }, [isCheckOtpSuccess]);

  useEffect(() => {
    if (isConfirmEmail == 2) {
      setIsConfirmEmail(1);
      setIsCheckOtpSuccess(3);
    } else if (isConfirmEmail == 3) {
      setIsConfirmEmail(1);
      setIsCheckOtpSuccess(2);
    }
  }, [isConfirmEmail]);

  useEffect(() => {
    if (isEmailVerification) {
      otpRef.current?.focus();
      setIsEmailVerification(false);
      setIsCheckSendOtp(isCheckSendOtp + 1);
    }
  }, [isEmailVerification]);

  useEffect(() => {
    if (isFindAccount == 2) {
      setIsGetFindAccount(1);
      NavigationService.navigate('ResultSearchIdScreen', {
        email,
        isCheckAccount: true,
        fullName: name,
      });
    } else if (isFindAccount == 3) {
      setIsGetFindAccount(1);
      NavigationService.navigate('ResultSearchIdScreen', { email });
    }
  }, [isFindAccount]);

  const _changePassword = () => {
    if (isCheckOtpSuccess == 3 && nameChangePass) {
      Keyboard.dismiss();
      NavigationService.navigate('ResetPasswordScreen', {
        email: idEmail,
        fullName: nameChangePass,
        isInformationSuccess: true,
      });
    } else {
      if (!validator.isEmail(idEmail)) {
        setErrorEmailReset(true);
      }
      if (validator.isEmail(idEmail) && isCheckOtpSuccess != 3) {
        setIsCheckOtpSuccess(2);
      }
      if (!nameChangePass) {
        setErrorNameReset(true);
      }
    }
  };

  const _sendOtp = async () => {
    if (validator.isEmail(idEmail)) {
      setIsLoadingSendOtp(true);
      await emailVerification({
        email: idEmail,
      });
      setCertificateNumber('');
      setIsLoadingSendOtp(false);
    } else {
      if (!validator.isEmail(idEmail)) {
        setErrorEmailReset(true);
      }
    }
  };

  const _searchId = async () => {
    if (name && validator.isEmail(email)) {
      await getFindAccount({
        email,
        full_name: name,
      });
    } else {
      if (!name) {
        setErrorNameSearch(true);
      }
      if (!validator.isEmail(email)) {
        setErrorEmailSearch(true);
      }
    }
  };

  const _confirmOtp = async () => {
    if (certificateNumber) {
      Keyboard.dismiss();
      setIsLoadingConfirmOtp(true);
      await confirmEmail({
        email: idEmail,
        code: certificateNumber,
      });
      setIsLoadingConfirmOtp(false);
    } else {
      if (!certificateNumber) {
        setIsCheckOtpSuccess(2);
      }
    }
  };

  const _handleTimeCount = useMemo(() => {
    const minute = Math.floor(countDown / 60);
    const second =
      Math.round(countDown % 60) < 10
        ? `0${Math.round(countDown % 60)}`
        : Math.round(countDown % 60);

    return `${minute}:${second}`;
  }, [countDown]);

  const _renderFindAccount = () => (
    <>
      <View style={[localStyles.wrapperAgreeAll]}>
        <View
          style={{
            borderBottomWidth: 0.4,
            borderBottomColor: colors.gray_200,
          }}>
          <Text
            style={[
              styles.text14Regular,
              localStyles.containerPadding,
              localStyles.textContent,
            ]}>
            {i18n.t('query_account_information.search_id')}
          </Text>
        </View>
      </View>
      <View style={[localStyles.containerPadding, { marginTop: 24 }]}>
        <Text style={[styles.text14Medium, localStyles.textLabel]}>
          {i18n.t('query_account_information.name')}
        </Text>
        <TextInput
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t('query_account_information.place_holder_name')}
          placeholderTextColor={colors.hint}
          style={[
            styles.text14Regular,
            styles.input,
            localStyles.input,
            {
              borderColor: errorNameSearch
                ? colors.red
                : colors.border_input_gray,
            },
          ]}
          keyboardType="default"
          onChangeText={(text: string) => {
            setName(text);
            setErrorNameSearch(false);
          }}
          value={name}
          onSubmitEditing={() => emailRef.current?.focus()}
          secureTextEntry={false}
          autoCapitalize="none"
          autoFocus={false}
        />
        {errorNameSearch && (
          <Text
            style={[
              styles.text14Regular,
              localStyles.textLabel,
              { color: colors.red, marginTop: 10 },
            ]}>
            {i18n.t('register.error_enter')}
          </Text>
        )}
      </View>
      <View style={[localStyles.containerPadding, { marginTop: 21 }]}>
        <Text style={[styles.text14Medium, localStyles.textLabel]}>
          {i18n.t('query_account_information.email')}
        </Text>
        <TextInput
          ref={emailRef}
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t('query_account_information.place_holder_email')}
          placeholderTextColor={colors.hint}
          style={[
            styles.text14Regular,
            styles.input,
            localStyles.input,
            {
              borderColor: errorEmailSearch
                ? colors.red
                : colors.border_input_gray,
            },
          ]}
          keyboardType="default"
          onChangeText={(text: string) => {
            setEmail(text);
            setErrorEmailSearch(false);
          }}
          value={email}
          secureTextEntry={false}
          autoCapitalize="none"
          autoFocus={false}
        />
        {errorEmailSearch && (
          <Text
            style={[
              styles.text14Regular,
              localStyles.textLabel,
              { color: colors.red, marginTop: 10 },
            ]}>
            {i18n.t('register.error_email')}
          </Text>
        )}
      </View>
      <View style={localStyles.containerPadding}>
        <Button
          mode="contained"
          onPress={_searchId}
          style={[styles.button, localStyles.button]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={isLoading}>
          {i18n.t('query_account_information.search_id')}
        </Button>
      </View>
    </>
  );

  const _renderActionOtp = () => (
    <View style={{ flex: 2, justifyContent: 'space-between' }}>
      <Button
        mode="contained"
        onPress={_sendOtp}
        style={[
          styles.button,
          localStyles.buttonCertificate,
          {
            backgroundColor: colors.btn_black,
          },
        ]}
        uppercase={true}
        labelStyle={[styles.text14Medium, localStyles.labelCertificate]}
        disabled={isLoadingSendOtp || isCheckOtpSuccess == 3}
        loading={isLoadingSendOtp}>
        {i18n.t('register.confirm')}
      </Button>
      <Button
        mode="contained"
        onPress={_confirmOtp}
        style={[
          styles.button,
          localStyles.buttonCertificate,
          {
            backgroundColor:
              isCheckSendOtp != 1 && countDown > 0
                ? colors.btn_black
                : colors.gold_500,
          },
        ]}
        uppercase={true}
        labelStyle={[
          styles.text14Medium,
          localStyles.labelCertificate,
          { width: '80%' },
        ]}
        disabled={isLoadingConfirmOtp || isCheckOtpSuccess == 3}
        loading={false}>
        {i18n.t('register.test_certificate')}
      </Button>
    </View>
  );

  const _renderInputEmailChangePassword = () => (
    <View style={[localStyles.containerPadding, { marginTop: 24 }]}>
      <Text style={[styles.text14Medium, localStyles.textLabel]}>
        {i18n.t('query_account_information.email')}
      </Text>
      <View
        style={[styles.row]}
        pointerEvents={isCheckOtpSuccess == 3 ? 'none' : 'auto'}>
        <View style={{ flex: 4.5 }}>
          <View pointerEvents={isCheckSendOtp == 2 ? 'none' : 'auto'}>
            <TextInput
              numberOfLines={1}
              returnKeyType="next"
              placeholder={i18n.t('register.id_email')}
              placeholderTextColor={colors.hint}
              style={[
                styles.input,
                styles.text14Regular,
                localStyles.input,
                {
                  marginBottom: errorEmailReset ? 0 : 12,
                  borderColor: errorEmailReset
                    ? colors.red
                    : colors.border_input_gray,
                },
              ]}
              keyboardType="default"
              onChangeText={(text: string) => {
                setIdEmail(text);
                setErrorEmailReset(false);
              }}
              onSubmitEditing={_sendOtp}
              value={idEmail}
              secureTextEntry={false}
              autoCapitalize="none"
              autoFocus={false}
            />
            {errorEmailReset && (
              <Text
                style={[
                  styles.text14Regular,
                  localStyles.textLabel,
                  { color: colors.red, marginTop: 10 },
                ]}>
                {i18n.t('register.error_email')}
              </Text>
            )}
          </View>
          <TextInput
            ref={otpRef}
            numberOfLines={1}
            returnKeyType="next"
            placeholder={
              isCheckOtpSuccess == 3
                ? i18n.t('query_account_information.authentication_completes')
                : i18n.t('register.certificate_number')
            }
            placeholderTextColor={colors.hint}
            style={[
              styles.input,
              styles.text14Regular,
              localStyles.input,
              {
                borderColor:
                  isCheckOtpSuccess == 2
                    ? colors.red
                    : colors.border_input_gray,
              },
            ]}
            keyboardType="default"
            onChangeText={(text: string) => {
              setCertificateNumber(text);
              setIsCheckOtpSuccess(1);
            }}
            value={certificateNumber}
            secureTextEntry={false}
            autoCapitalize="none"
            autoFocus={false}
          />
          {isCheckSendOtp != 1 && isCheckOtpSuccess == 1 && (
            <View
              style={{
                position: 'absolute',
                right: 10,
                bottom: 23,
              }}>
              <Text
                style={[
                  styles.text14SemiBold,
                  {
                    color: countDown ? colors.btn_black : colors.red,
                  },
                ]}>
                {_handleTimeCount}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 0.3 }} />
        {_renderActionOtp()}
      </View>
      {countDown > 0 && isCheckOtpSuccess == 2 && (
        <Text
          style={[
            styles.text14Regular,
            localStyles.textLabel,
            { color: colors.red, marginTop: 15 },
          ]}>
          {i18n.t('register.error_otp')}
        </Text>
      )}
      {countDown <= 0 && (
        <Text
          style={[
            styles.text14Regular,
            localStyles.textLabel,
            { color: colors.red, marginTop: 15 },
          ]}>
          {i18n.t('register.error_time')}
        </Text>
      )}
    </View>
  );

  const _renderChangePassword = () => (
    <>
      <View style={localStyles.wrapperAgreeAll}>
        <View
          style={{
            borderBottomWidth: 0.4,
            borderBottomColor: colors.gray_200,
          }}>
          <Text
            style={[
              styles.text14Regular,
              localStyles.textContent,
              localStyles.containerPadding,
            ]}>
            {i18n.t('query_account_information.change_password')}
          </Text>
        </View>
      </View>
      {_renderInputEmailChangePassword()}
      <View style={[localStyles.containerPadding, { marginTop: 30 }]}>
        <Text
          style={[
            styles.text14Medium,
            { fontWeight: '400', marginBottom: 10 },
          ]}>
          {i18n.t('query_account_information.name')}
        </Text>
        <TextInput
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t('query_account_information.place_holder_name')}
          placeholderTextColor={colors.hint}
          style={[
            styles.input,
            styles.text14Regular,
            localStyles.input,
            {
              borderColor: errorNameReset
                ? colors.red
                : colors.border_input_gray,
            },
          ]}
          keyboardType="default"
          onChangeText={(text: string) => {
            setNameChangePass(text);
            setErrorNameReset(false);
          }}
          value={nameChangePass}
          secureTextEntry={false}
          autoCapitalize="none"
          autoFocus={false}
        />
        {errorNameReset && (
          <Text
            style={[
              styles.text14Regular,
              localStyles.textLabel,
              { color: colors.red, marginTop: 10 },
            ]}>
            {i18n.t('register.error_enter')}
          </Text>
        )}
      </View>
      <View style={localStyles.containerPadding}>
        <Button
          mode="contained"
          onPress={_changePassword}
          style={[styles.button, localStyles.button]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={isLoading}>
          {i18n.t('query_account_information.change_password')}
        </Button>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[localStyles.container]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={[styles.container]}
          keyboardShouldPersistTaps='handled'
        >
          <StatusBar barStyle="dark-content" animated={true} />
          {_renderFindAccount()}
          {_renderChangePassword()}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default QueryAccountInformationScreen;
