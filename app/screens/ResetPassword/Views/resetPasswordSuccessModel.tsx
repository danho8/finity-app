import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import { modalActionSelector, modalStateSelector } from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';

const ResetPasswordSuccessModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsResetPasswordSuccess, setIsChangePasswordSuccessVisible } =
    useStoreActions(modalActionSelector);
  const { isResetPasswordSuccessVisible, isChangePasswordSuccessVisible } =
    useStoreState(modalStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 32.5,
          backgroundColor: colors.background,
          elevation: 4,
          shadowOffset: { width: 0, height: 4 },
          shadowColor: colors.shadow_color,
        },
        textContent: {
          width: 400,
          textAlign: 'center',
        },
        title: {
          marginTop: 5,
          marginBottom: 29,
          alignSelf: 'center',
          lineHeight: 19,
          fontWeight: '400',
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 19,
          right: 17.01,
          zIndex: 1,
        },
        iconClose: {
          width: 17.99,
          height: 18,
        },
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
          marginBottom: 36,
        },
        button: {
          marginHorizontal: 55,
          backgroundColor: colors.btn_black,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: Platform.OS == 'ios' ? 10.5 : 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
      }),
    [],
  );

  const _confirm = () => {
    isResetPasswordSuccessVisible && NavigationService.navigate('LoginScreen');
    isChangePasswordSuccessVisible &&
      NavigationService.navigate('ProfileScreen');
    setIsResetPasswordSuccess(false);
    setIsChangePasswordSuccessVisible(false);
  };

  return (
    <Dialog
      visible={isResetPasswordSuccessVisible || isChangePasswordSuccessVisible}
      onDismiss={_confirm}
      dismissable={true}
      style={[styles.boxLogin, localStyles.container]}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_confirm}>
          <Image
            source={require('../../../assets/images/icon-close-new.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.text16Bold, localStyles.title]}>
        {isChangePasswordSuccessVisible
          ? i18n.t('reset_password.title_change_password_success')
          : i18n.t('reset_password.title_reset_password_success')}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {i18n.t('reset_password.content_reset_password_success')}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_confirm}
        style={[styles.button, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={false}
        loading={false}>
        {i18n.t('reset_password.confirm')}
      </Button>
    </Dialog>
  );
};

export default ResetPasswordSuccessModel;
