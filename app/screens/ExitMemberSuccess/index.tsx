import i18n from "app/i18n";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { authActionSelector, modalActionSelector } from "app/store";
import { useStoreActions } from "easy-peasy";

import styles from "../../styles";
import NavigationService from "app/navigation/NavigationService";
import { storage } from "app/store/storage";
import { useNavigation } from "@react-navigation/native";


const ExitMemberSuccess: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const { setIsLogoutVisible } = useStoreActions(modalActionSelector);
  const { logout, setUser, setToken } = useStoreActions(authActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
          justifyContent: 'center',
        },
        labelButton: {
          textTransform: 'capitalize',
        },
        button: {
          backgroundColor: colors.primary,
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

  const _confirm = async () => {
    await logout();
    storage.removeItem('token');
    storage.removeItem('isAutoLogin');
    setUser({});
    setToken(false);
    NavigationService.navigate(i18n.t('tab_navigator.coin'));
    NavigationService.navigate('LoginScreen');
    setIsLogoutVisible(false);
  }


  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <Text style={[styles.text20Regular, { alignSelf: 'center' }]}>
        {i18n.t('edit_profile_success.edit_profile_success')}
      </Text>
      <Text style={[styles.text16Regular, { alignSelf: 'center', textAlign: 'center', lineHeight: 28, marginTop: 20, }]}>
        {i18n.t('edit_profile_success.content_text')}
      </Text>
      <Text style={[styles.text16Regular, { alignSelf: 'center', textAlign: 'center', marginBottom: 40 }]}>
        {i18n.t('edit_profile_success.content_texttow')}
      </Text>
      <Button
        mode="contained"
        onPress={_confirm}
        style={[styles.button, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={isLoading}
        loading={isLoading}
      >
        {i18n.t("edit_profile_success.confirm")}
      </Button>
    </View>
  );
}

export default ExitMemberSuccess;
