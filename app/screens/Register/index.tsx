import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import styles from '../../styles';
import i18n from 'app/i18n';
import validator from 'validator';
import NavigationService from 'app/navigation/NavigationService';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { authActionSelector, authStateSelector, shopStateSelector } from 'app/store';
import { enumGender } from 'app/service/interface/auth.interface';
import { validatePassword } from 'app/utils/validation';
import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';
import CheckBoxCustom from 'app/components/CheckboxCustom';
import DatePicker from 'react-native-date-picker';
import TextErrorCustom from 'app/components/TextErrorCustom';

const _checkDateOfBirth = (dateOfBirth: any) => {
  return dateOfBirth ? dateOfBirth : new Date(moment().subtract(14, 'years'));
}

const _showTextDateOfBirth = (dateOfBirth: any) => {
  return dateOfBirth
    ? moment(dateOfBirth).format('YYYY/MM/DD') ||
    i18n.t('register.place_holder_date_of_birth')
    : ''
}

const RegisterScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();
  const otpRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();
  const nameRef = useRef();
  const nickNameRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [isLoadingConfirmOtp, setIsLoadingConfirmOtp] = useState(false);
  const [idEmail, setIdEmail] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isCheckPass, setIsCheckPass] = useState(false);
  const [isCheckRePass, setIsChekRePass] = useState(false);
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<any>();
  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [isNoChoose, setIsNoChoose] = useState(true);
  const [isCheckSendOtp, setIsCheckSendOtp] = useState(1);
  const [isCheckOtpSuccess, setIsCheckOtpSuccess] = useState(1);
  const [countDown, setCountDown] = useState(300);
  const {
    emailVerification,
    setIsEmailVerification,
    confirmEmail,
    setIsConfirmEmail,
    register,
    setIsRegister,
    nations,
  } = useStoreActions(authActionSelector);
  const { isEmailVerification, isConfirmEmail, isRegister } =
    useStoreState(authStateSelector);
  const [open, setOpen] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorNickName, setErrorNickName] = useState(false);
  const [errorConfirmNewPass, setErrorConfirmNewPass] = useState(false);
  const [errorChangePass, setErrorChangePass] = useState(false);
  const [errorEmailNull, setErrorEmailNull] = useState(false);
  const [errorPasswordNull, setErrorPassWordNull] = useState(false);
  const [errorConfirmNewPassNull, setErrorConfirmNewPassNull] = useState(false);
  const { isStatusFunctions } = useStoreState(shopStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'column',
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        containerScrollview: {
          flexDirection: 'column',
          flexGrow: 1,
          paddingBottom: 5,
          backgroundColor: colors.background,
          paddingTop: 20,
        },
        wrapperAgreeAll: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 14,
          paddingHorizontal: 16,
        },
        wrapperAgreeAll_1: {
          width: '100%',
          borderBottomWidth: 1,
          borderBottomColor: colors.backgroundContent,
        },
        checkbox: {
          flexDirection: 'row',
        },
        labelBox: {
          fontSize: 14,
          fontWeight: 'normal',
          color: colors.text_content,
        },
        labelBoxTerms: {
          fontSize: 14,
          fontWeight: '400',
          color: colors.text_content,
        },
        button: {
          backgroundColor: colors.primary,
          marginTop: 30,
          marginBottom: 140,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
        labelCertificate: {
          letterSpacing: 0.5,
          paddingVertical: 1.5,
          textTransform: 'capitalize',
          fontSize: 12,
        },
        buttonCertificate: {
          borderRadius: 5,
          width: '100%',
          marginHorizontal: 2,
          lineHeight: 17,
          paddingVertical: Platform.OS == 'ios' ? 3.5 : 5.5,
          marginTop: 1,
          backgroundColor: colors.white,
        },
        wrapperItem: {
          width: Dimensions.get('screen').width - 32,
          padding: 10,
        },
        textTimeCount: {
          position: 'absolute',
          lineHeight: 17,
          bottom: 16,
          right: 10.5,
        },
        iconDropdown: {
          width: 14,
          height: 10,
        },
        textFormat: {
          marginVertical: 10,
        },
        btnSetDateOfBirth: {
          position: 'absolute',
          right: 10,
          justifyContent: 'center',
          height: '100%'
        }
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
    nations();
  }, []);
  useEffect(() => {
    if (countDown > 0 && isCheckSendOtp != 1 && isCheckOtpSuccess != 3) {
      const timeCountDown = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);
      return () => {
        clearInterval(timeCountDown);
      };
    }
  }, [countDown, isCheckSendOtp, isCheckOtpSuccess]);
  useEffect(() => {
    setCountDown(300);
  }, [isCheckSendOtp]);
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
    if (isRegister) {
      setIsRegister(false);
      NavigationService.navigate('RegisterSuccessScreen');
    }
  }, [isRegister]);
  useEffect(() => {
    if (isCheckOtpSuccess == 3) {
      setCertificateNumber(i18n.t('register.verified'));
    }
  }, [isCheckOtpSuccess]);
  useEffect(() => {
    if (isEmailVerification) {
      setIsEmailVerification(false);
      setIsCheckSendOtp(isCheckSendOtp + 1);
    }
  }, [isEmailVerification]);
  const _next = async () => {
    let gender = enumGender.default;
    if (isMale) {
      gender = enumGender.male;
    } else if (isFemale) {
      gender = enumGender.female;
    }
    if (
      nickName &&
      name &&
      password &&
      confirmNewPassword &&
      password == confirmNewPassword &&
      isCheckRePass &&
      isCheckPass &&
      (isMale || isFemale || isNoChoose) &&
      idEmail &&
      isCheckOtpSuccess == 3
    ) {
      setIsLoading(true);
      await register({
        nick_name: nickName,
        full_name: name,
        nation_id: '',
        password,
        birthday: moment(dateOfBirth).format('YYYY/MM/DD'),
        location_detail: '',
        gender,
        email: idEmail,
      });
      setIsLoading(false);
    } else {
      _handleError();
    }
  };
  const _handleError = () => {
    if (!validator.isEmail(idEmail)) {
      if (idEmail == '') {
        setErrorEmailNull(true)
      } else {
        setErrorEmail(true);
      }
    }
    if (!validatePassword(password)) {
      if (password == '') {
        setErrorPassWordNull(true)
      } else {
        setErrorPass(true);
      }
    }

    if (validator.isEmail(idEmail) && isCheckOtpSuccess != 3) {
      setIsCheckOtpSuccess(2);
    }
    if (!name) {
      setErrorName(true);
    }
    if (!nickName) {
      setErrorNickName(true);
    }
    _handelErrorPass();
  };

  const _handelErrorPass = () => {
    if (!confirmNewPassword) {
      if (confirmNewPassword == '') {
        setErrorConfirmNewPassNull(true)
      } else {
        setErrorConfirmNewPass(true);
      }
    }
    if (password && confirmNewPassword && password != confirmNewPassword) {
      setErrorChangePass(true);
    }
  }

  const _handleChooseMale = () => {
    setIsMale(true);
    setIsFemale(false);
    setIsNoChoose(false);
  };
  const _handleChooseFemale = () => {
    setIsMale(false);
    setIsFemale(true);
    setIsNoChoose(false);
  };
  const _handleChooseNoChoose = () => {
    setIsMale(false);
    setIsFemale(false);
    setIsNoChoose(true);
  };
  const _sendOtp = async () => {
    if (!validator.isEmail(idEmail)) {
      if (idEmail == '') {
        setErrorEmailNull(true)
      } else {
        setErrorEmail(true);
      }
      return;
    }

    otpRef.current?.focus();
    setIsLoadingSendOtp(true);
    await emailVerification({
      email: idEmail,
      register: 1,
    });
    setCountDown(300);
    setIsCheckOtpSuccess(1);
    setIsLoadingSendOtp(false);
  };

  const _confirmOtp = async () => {
    if (certificateNumber) {
      setIsLoadingConfirmOtp(true);
      await confirmEmail({
        email: idEmail,
        code: certificateNumber,
      });
      passRef.current?.focus();
      setIsLoadingConfirmOtp(false);
    } else {
      if (!certificateNumber) {
        setIsCheckOtpSuccess(2);
      }
    }
  };

  const _renderActionOtp = () => (
    <View>
      <Button
        mode="contained"
        onPress={_sendOtp}
        style={[
          localStyles.buttonCertificate,
          {
            backgroundColor:
              isCheckOtpSuccess == 3 ? colors.black : colors.text_content,
            marginBottom: 16,
          },
        ]}
        uppercase={true}
        labelStyle={[
          styles.text14,
          localStyles.labelCertificate,
          { color: colors.white },
        ]}
        disabled={isLoadingSendOtp || isCheckOtpSuccess == 3}
        loading={isLoadingSendOtp}>
        {isCheckSendOtp != 1
          ? i18n.t('register.re_send_otp')
          : i18n.t('register.confirm')}
      </Button>
      {(errorEmail || errorEmailNull) && <Text style={{ paddingBottom: Platform.OS == 'ios' ? 14.5 : 10 }} />}
      <Button
        mode="contained"
        onPress={_confirmOtp}
        style={[
          localStyles.buttonCertificate,
          {
            backgroundColor:
              isCheckSendOtp != 1 && countDown > 0
                ? colors.black
                : colors.primary,
          },
        ]}
        uppercase={true}
        labelStyle={[
          styles.text14,
          localStyles.labelCertificate,
          { color: colors.white },
        ]}
        disabled={isLoadingConfirmOtp || isCheckOtpSuccess == 3}
        loading={isLoadingConfirmOtp}>
        {isCheckOtpSuccess == 3
          ? i18n.t('register.completed')
          : i18n.t('register.test_certificate')}
      </Button>
    </View>
  );

  const borderColorFunction = (validateHollow?: any, validate?: any) => {
    let result = colors.border_gray
    let errorColor = colors.red;
    if (validateHollow || validate) {
      result = errorColor;
    }
    return result
  }

  const errorConfirmNewPassFunction = (text: string) => {
    if (validatePassword(text)) {
      setIsChekRePass(true);
      setErrorChangePass(true);
      setErrorConfirmNewPass(true);
      setErrorConfirmNewPassNull(true)
    } else {
      setIsChekRePass(false);
      setErrorChangePass(false);
      setErrorConfirmNewPass(false);
      setErrorConfirmNewPassNull(false)
    }
    setErrorChangePass(false);
    setErrorConfirmNewPass(false);
    setConfirmNewPassword(text);
    setErrorConfirmNewPassNull(false)
  }

  const _renderInputOtp = () => (
    <View style={{ marginTop: 28 }}>
      <Text style={[styles.text14, { marginBottom: 5 }]}>
        {i18n.t('register.id_email_label')}
        <Text style={{ color: colors.red }}>*</Text>
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
              placeholderTextColor={colors.shadow}
              style={[
                styles.inputRegister,
                styles.text14Regular,
                {
                  marginBottom: 16,
                  borderColor: borderColorFunction(errorEmailNull, errorEmail)
                },
              ]}
              keyboardType="email-address"
              onChangeText={(text: string) => {
                setIdEmail(text);
                setErrorEmail(false);
                setErrorEmailNull(false)
              }}
              onSubmitEditing={_sendOtp}
              value={idEmail}
              secureTextEntry={false}
              autoCapitalize="none"
              autoFocus={false}
            />
            <TextErrorCustom
              error={errorEmail}
              textError={`${i18n.t('register.error_email')}`}
              style={{ paddingBottom: 10, width: 500 }}
            />
            <TextErrorCustom
              error={errorEmailNull}
              textError={`${i18n.t('register.error_enter')}`}
              style={{ paddingBottom: 10, width: 500 }}
            />
          </View>
          <TextInput
            ref={otpRef}
            numberOfLines={1}
            returnKeyType="next"
            placeholder={i18n.t('register.certificate_number')}
            placeholderTextColor={colors.shadow}
            style={[
              styles.inputRegister,
              styles.text14Regular,
              {
                borderColor:
                  isCheckOtpSuccess == 2 ? colors.red : colors.border_gray,
              },
            ]}
            keyboardType="numeric"
            maxLength={isCheckOtpSuccess != 3 ? 4 : 100}
            onChangeText={(text: string) => {
              setCertificateNumber(text);
              setIsCheckOtpSuccess(1);
            }}
            onSubmitEditing={_confirmOtp}
            value={certificateNumber}
            secureTextEntry={false}
            autoCapitalize="none"
            autoFocus={false}
          />
          {isCheckSendOtp != 1 && isCheckOtpSuccess == 1 && (
            <View style={[localStyles.textTimeCount]}>
              <Text
                style={[
                  styles.text14,
                  { color: countDown ? colors.black : colors.red },
                ]}>
                {_handleTimeCount}
              </Text>
            </View>
          )}
        </View>
        {_renderActionOtp()}
      </View>
      {countDown > 0 && isCheckOtpSuccess == 2 && (
        <Text
          style={[styles.text14Regular, { color: colors.red, marginTop: 15 }]}>
          {i18n.t('register.error_otp')}
        </Text>
      )}
      {countDown <= 0 && (
        <Text
          style={[styles.text14Regular, { color: colors.red, marginTop: 15 }]}>
          {i18n.t('register.error_time')}
        </Text>
      )}
    </View>
  );

  const _handleRePassword = () => (
    <>
      {password && confirmNewPassword && password != confirmNewPassword && (
        <Text style={[styles.text14Regular, { color: colors.red }]}>
          {i18n.t('register.susussce_password')}
        </Text>
      )}
      {errorChangePass && (
        <Text style={[styles.text14Regular, { color: colors.red }]}>
          {i18n.t('register.error_new_password')}
        </Text>
      )}
    </>
  );

  const _handleRePasswordTow = () => (
    <Text
      style={[
        styles.text14Regular,
        {
          color:
            errorConfirmNewPass || (confirmNewPassword && !isCheckRePass)
              ? colors.red
              : colors.blue,
        },
      ]}>
      {i18n.t('register.error_re_pasword')}
    </Text>
  );

  const _handleAllRePassword = () => (
    <Text>
      {!isCheckRePass ||
        (password && confirmNewPassword && password == confirmNewPassword)
        ? (
          <>{_handleRePasswordTow()}</>
        ) : (
          <>{_handleRePassword()}</>
        )}
    </Text>
  );

  const _handlePassWord = () => (
    <Text
      style={[
        styles.text14Regular,
        {
          color:
            errorPass || (password && !isCheckPass)
              ? colors.red
              : colors.blue,
        },
      ]}>
      {i18n.t('register.validate_text')}
    </Text>
  )

  const _handleTimeCount = useMemo(() => {
    const minute = Math.floor(countDown / 60);
    const second =
      Math.round(countDown % 60) < 10
        ? `0${Math.round(countDown % 60)}`
        : Math.round(countDown % 60);
    return `${minute}:${second}`;
  }, [countDown]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={[styles.container, localStyles.containerScrollview]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <StatusBar barStyle="dark-content" animated={true} />
        <View style={[localStyles.wrapperAgreeAll_1]}>
          <View style={[localStyles.wrapperAgreeAll]}>
            <Text style={[styles.text16, { color: colors.black }]}>
              {i18n.t('register.enter_info_account')}
            </Text>
            <Text style={[styles.text16, { color: colors.red }]}>
              {i18n.t('register.requirement')}
              <Text style={[styles.text14Regular, { color: colors.red }]}>*</Text>
            </Text>
          </View>
        </View>
        <View style={[styles.container, localStyles.container]}>
          {_renderInputOtp()}
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.text14, { marginBottom: 10 }]}>
              {i18n.t('register.password_label')}
              <Text style={{ color: colors.red }}>*</Text>
            </Text>
            <TextInput
              ref={passRef}
              numberOfLines={1}
              returnKeyType="next"
              placeholder={i18n.t('register.password')}
              placeholderTextColor={colors.shadow}
              style={[
                styles.inputRegister,
                styles.text14Regular,
                {
                  marginBottom: 10,
                  borderColor: borderColorFunction(errorPass || (password && !isCheckPass), errorPasswordNull)
                },
              ]}
              keyboardType="default"
              onChangeText={(text: string) => {
                if (validatePassword(text)) {
                  setIsCheckPass(true);
                } else {
                  setIsCheckPass(false);
                }
                setErrorPassWordNull(false)
                setErrorPass(false);
                setPassword(text);
              }}
              onSubmitEditing={() => confirmPassRef.current?.focus()}
              value={password}
              secureTextEntry={true}
              autoCapitalize="none"
              autoFocus={false}
            />
            {errorPasswordNull ?
              <TextErrorCustom
                textError={`${i18n.t('register.error_enter')}`}
                error={errorPasswordNull}
              />
              : _handlePassWord()
            }
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={[styles.text14, { marginBottom: 10 }]}>
              {i18n.t('register.confirm_new_password')}
              <Text style={{ color: colors.red }}>*</Text>
            </Text>
            <TextInput
              ref={confirmPassRef}
              numberOfLines={1}
              returnKeyType="next"
              placeholder={i18n.t('reset_password.comfirm_re_password')}
              placeholderTextColor={colors.shadow}
              style={[
                styles.inputRegister,
                styles.text14Regular,
                {
                  borderColor:
                    borderColorFunction
                      (errorConfirmNewPassNull ||
                        (password && confirmNewPassword && password != confirmNewPassword),
                        errorConfirmNewPass || (confirmNewPassword && !isCheckRePass))
                },
              ]}
              keyboardType="default"
              onChangeText={(text: string) => errorConfirmNewPassFunction(text)}
              onSubmitEditing={() => nameRef.current?.focus()}
              value={confirmNewPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              autoFocus={false}
            />
            {errorConfirmNewPassNull ?
              <TextErrorCustom
                textError={`${i18n.t('register.error_enter')}`}
                style={[localStyles.textFormat]}
                error={errorConfirmNewPassNull}
              />
              : <Text style={[localStyles.textFormat]}>
                {_handleAllRePassword()}
              </Text>
            }
          </View>
          <View>
            <Text style={[styles.text14, { marginBottom: 10 }]}>
              {i18n.t('register.name')}
              <Text style={{ color: colors.red }}>*</Text>
            </Text>
            <TextInput
              ref={nameRef}
              numberOfLines={1}
              returnKeyType="next"
              placeholder={i18n.t('register.place_holder_name')}
              placeholderTextColor={colors.shadow}
              style={[
                styles.inputRegister,
                styles.text14Regular,
                { borderColor: errorName ? colors.red : colors.border_gray },
              ]}
              keyboardType="default"
              onChangeText={(text: string) => {
                setName(text);
                setErrorName(false);
              }}
              value={name}
              onSubmitEditing={() => nickNameRef.current?.focus()}
              secureTextEntry={false}
              autoCapitalize="none"
              autoFocus={false}
            />
            {errorName && (
              <Text
                style={[
                  styles.text14Regular,
                  { color: colors.red, marginTop: 10 },
                ]}>
                {i18n.t('register.error_enter')}
              </Text>
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.text14, { marginBottom: 10 }]}>
              {i18n.t('register.nickname')}
              <Text style={{ color: colors.red }}>*</Text>
            </Text>
            <TextInput
              ref={nickNameRef}
              numberOfLines={1}
              returnKeyType="next"
              placeholder={i18n.t('register.place_holder_nickname')}
              placeholderTextColor={colors.shadow}
              style={[
                styles.inputRegister,
                styles.text14Regular,
                { borderColor: errorNickName ? colors.red : colors.border_gray },
              ]}
              keyboardType="default"
              onChangeText={(text: string) => {
                setNickName(text);
                setErrorNickName(false);
              }}
              value={nickName}
              onSubmitEditing={() => setOpen(true)}
              secureTextEntry={false}
              autoCapitalize="none"
              autoFocus={false}
            />
            {errorNickName && (
              <Text
                style={[
                  styles.text14Regular,
                  { color: colors.red, marginTop: 10 },
                ]}>
                {i18n.t('register.error_enter')}
              </Text>
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.text16, { marginBottom: 10 }]}>
              {i18n.t('register.date_of_birth')}
              {isStatusFunctions && (
                <Text style={{ color: colors.red }}>*</Text>
              )} </Text>
            <View>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <View pointerEvents="none">
                  <TextInput
                    style={[
                      styles.inputRegister,
                      {
                        color: colors.black,
                      },
                    ]}
                    keyboardType="default"
                    onChangeText={(text: string) => {
                      setDateOfBirth(text);
                    }}>
                      {_showTextDateOfBirth(dateOfBirth)}
                  </TextInput>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.btnSetDateOfBirth}
                onPress={() => setDateOfBirth('')}
              >
                {dateOfBirth && (
                  <Image
                    source={require('../../assets/images/icon-close.png')}
                    style={{ width: 14, height: 14 }}
                    resizeMode='cover'
                  />
                )
                }
              </TouchableOpacity>
            </View>
            <View>
              <DatePicker
                modal
                open={open}
                date={_checkDateOfBirth(dateOfBirth)}
                mode={'date'}
                confirmText={i18n.t('register.confirm')}
                cancelText={i18n.t('register.cancel')}
                title={i18n.t('register.select_date')}
                minimumDate={new Date(1929, 12, 1)}
                maximumDate={new Date(moment().subtract(14, 'years'))}
                onConfirm={date => {
                  setOpen(false);
                  setDateOfBirth(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.text14, { marginBottom: 15 }]}>
              {i18n.t('register.gender')}
            </Text>
            <View style={[localStyles.checkbox]}>
              <CheckBoxCustom
                textContent={i18n.t('register.male')}
                value={isMale}
                changeValue={_handleChooseMale}
                space={15}
                isReverse={false}
                labelStyle={[localStyles.labelBox]}
              />
              <CheckBoxCustom
                textContent={i18n.t('register.female')}
                value={isFemale}
                changeValue={_handleChooseFemale}
                space={15}
                isReverse={false}
                labelStyle={[localStyles.labelBox]}
              />
              <CheckBoxCustom
                textContent={i18n.t('register.no_choose')}
                value={isNoChoose}
                changeValue={_handleChooseNoChoose}
                space={15}
                isReverse={false}
                labelStyle={[localStyles.labelBox]}
              />
            </View>
          </View>
          <Button
            mode="contained"
            onPress={_next}
            style={[styles.button, localStyles.button]}
            uppercase={true}
            labelStyle={[styles.labelButton, localStyles.labelButton]}
            disabled={isLoading}
            loading={isLoading}>
            {i18n.t('register.register')}
          </Button>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
