import * as React from "react";
import { StyleSheet } from "react-native";
import { Modal, useTheme, Title, Button } from "react-native-paper";

import i18n from "../i18n";
import { useStoreActions, useStoreState } from "easy-peasy";
import { authActionSelector, authStateSelector, modalStateSelector } from "../store";
import styles from "app/styles";
import { storage } from "app/store/storage";
import NavigationService from "app/navigation/NavigationService";

export function ConnectivityModal() {
  const { connectivityModal } = useStoreState(modalStateSelector);
  const { token } = useStoreState(authStateSelector);
  const { setToken, setUser, setWallets } = useStoreActions(authActionSelector);

  const { colors }: any = useTheme();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.background,
          shadowColor: colors.shadow,
          borderRadius: 15,
          margin: 20,
          paddingHorizontal: 20,
          paddingVertical: 40,
          alignItems: "center",
        },
        centerText: {
          textAlign: "center",
          textAlignVertical: "center",
        },
        bold: {},
        btn: {
          width: 195,
        },
        button: {
          width: 150,
          borderRadius: 10,
          marginTop: 15,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
      }),

    [colors]
  );

  const _logout = async () => {
    storage.removeItem('token');
    storage.removeItem('isAutoLogin');
    setUser({});
    setToken(false);
    NavigationService.navigate(i18n.t('tab_navigator.go-rice'));
    NavigationService.navigate('LoginScreen');
    setWallets([]);
  }

  return (
    <Modal
      visible={connectivityModal}
      dismissable={false}
      contentContainerStyle={localStyles.container}
    >
      <Title style={[localStyles.bold]}>
        {i18n.t("notification.check_your_connection")}
      </Title>

      {token && (
        <Button
          mode="contained"
          onPress={_logout}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.primary },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}
        >
          {i18n.t("profile.logout")}
        </Button>
      )}
    </Modal>
  );
}
