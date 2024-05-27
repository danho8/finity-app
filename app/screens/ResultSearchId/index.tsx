import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import styles from '../../styles';

const ResultSearchIdScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
        buttonRed: {
          backgroundColor: colors.gold_500,
        },
        buttonBlack: {
          backgroundColor: colors.btn_black,
        },
        content: {
          textAlign: 'center',
          marginBottom: 13,
          color: colors.btn_black,
        },
        email: {
          textTransform: 'none',
          alignSelf: 'center',
          fontWeight: '600',
          fontSize: 18,
          lineHeight: 22,
          color: colors.btn_black,
        },
        title: {
          alignSelf: 'center',
          marginBottom: 23,
          fontWeight: 'bold',
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

  const _login = () => {
    NavigationService.navigate('LoginScreen');
  };

  const _forgotPass = () => {
    NavigationService.navigate('ResetPasswordScreen', {
      isInformationSuccess: true,
      email: route?.params?.email,
      fullName: route?.params?.fullName,
    });
  };

  const _retry = () => {
    NavigationService.navigate('QueryAccountInformationScreen');
  };

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t('result_search_id.result_search_id')}
      </Text>
      <Text style={[styles.text14Regular, localStyles.content]}>
        {i18n.t('result_search_id.content')}
      </Text>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 25,
          width: Dimensions.get('screen').width - 100,
        }}>
        <Text style={localStyles.email}>{route?.params?.email}</Text>
        {route?.params?.isCheckAccount ? (
          <Text style={localStyles.email}>{i18n.t('result_search_id.is')}</Text>
        ) : (
          <Text style={localStyles.email}>
            {i18n.t('result_search_id.and')}
          </Text>
        )}
      </View>
      {route?.params?.isCheckAccount ? (
        <Text
          style={[
            styles.text14Regular,
            localStyles.content,
            { marginBottom: 23 },
          ]}>
          {i18n.t('result_search_id.search_success')}
        </Text>
      ) : (
        <Text
          style={[
            styles.text14Regular,
            localStyles.content,
            { marginBottom: 23, color: colors.red },
          ]}>
          {i18n.t('result_search_id.search_error')}
        </Text>
      )}
      {route?.params?.isCheckAccount ? (
        <>
          <Button
            mode="contained"
            onPress={_login}
            style={[
              styles.button,
              localStyles.buttonBlack,
              { marginBottom: 15 },
            ]}
            uppercase={true}
            labelStyle={[styles.labelButton, localStyles.labelButton]}
            disabled={isLoading}
            loading={isLoading}>
            {i18n.t('result_search_id.login')}
          </Button>
          <Button
            mode="contained"
            onPress={_forgotPass}
            style={[styles.button, localStyles.buttonRed]}
            uppercase={true}
            labelStyle={[styles.labelButton, localStyles.labelButton]}
            disabled={isLoading}
            loading={isLoading}>
            {i18n.t('result_search_id.forgot_password')}
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          onPress={_retry}
          style={[styles.button, localStyles.buttonBlack]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={isLoading}>
          {i18n.t('result_search_id.retry')}
        </Button>
      )}
    </View>
  );
};

export default ResultSearchIdScreen;
