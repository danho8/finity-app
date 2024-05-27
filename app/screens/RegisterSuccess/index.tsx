import { useNavigation } from "@react-navigation/native";
import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";

import styles from "../../styles";

const RegisterSuccessScreen: React.FC = () => {
  const { colors }: any = useTheme();
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
        },
        button: {
          backgroundColor: colors.black,
        },
      }),
    []
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      })
    });
  }, [navigation]);

  const _next = () => {
    NavigationService.navigate('LoginScreen');
  }

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <Text style={[styles.title, { alignSelf: 'center', fontWeight: 'bold' }]}>
        {i18n.t('completed_register.completed_register')}
      </Text>
      <Text style={[styles.text20Regular, { textAlign: 'center', lineHeight: 28, marginVertical: 26 }]}>
        {i18n.t('completed_register.welcome_to')}
      </Text>
      <Text style={[styles.text14Regular, { textAlign: 'center', marginBottom: 61 }]}>
        {i18n.t('completed_register.re_login_en')}
        <Text style={[styles.text14, { color: colors.black }]}>{i18n.t('completed_register.cyfinity')}</Text>
        {i18n.t('completed_register.re_login')}
      </Text>
      <Button
        mode="contained"
        onPress={_next}
        style={[styles.button, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={isLoading}
        loading={isLoading}
      >
        {i18n.t("login.login")}
      </Button>
    </View>
  );
}

export default RegisterSuccessScreen;
