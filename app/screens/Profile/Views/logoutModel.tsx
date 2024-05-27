import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { authActionSelector, modalActionSelector, modalStateSelector } from "app/store";
import { storage } from "app/store/storage";
import styles from "app/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";

const LogoutModel: React.FC = () => {
  const { colors }: any = useTheme();
  const { setIsLogoutVisible } = useStoreActions(modalActionSelector);
  const { isLogoutVisible } = useStoreState(modalStateSelector);
  const { logout, setUser, setToken, setWallets } = useStoreActions(authActionSelector);
  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 34,
          paddingHorizontal: 32,
          backgroundColor: colors.background,
          borderRadius: 12,
        },
        textContent: {
          lineHeight: 22,
          textAlign: 'center',
        },
        title: {
          top: 20,
          position: 'absolute',
          marginBottom: 20,
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 20,
          right: 25,
          zIndex: 1,
        },
        iconClose: {
          width: 18,
          height: 18,
        },
        wrapperContent: {
          marginTop: 35,
          paddingHorizontal: 26,
          alignSelf: 'center',
          marginBottom: 20,
          width: 300,
        },
        button: {
          width: (Dimensions.get('screen').width - 130) / 2,
          borderRadius: 5,
          marginTop: 15,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
      }),
    []
  );
  const _confirm = async () => {
    await logout();
    storage.removeItem('token');
    storage.removeItem('isAutoLogin');
    setUser({});
    setToken(false);
    NavigationService.navigate(i18n.t('tab_navigator.go-rice'));
    NavigationService.navigate('LoginScreen');
    setIsLogoutVisible(false);
    setWallets([]);
  }
  const _cancel = () => {
    setIsLogoutVisible(false);
  }
  return (
    <Dialog
      visible={isLogoutVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}
    >
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_cancel}>
          <Image
            source={require('../../../assets/images/icon-close-black-model.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t("profile.logout")}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {i18n.t('profile.you_sure_logout')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          mode="contained"
          onPress={_cancel}
          style={[styles.button, localStyles.button, { backgroundColor: colors.primary }]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t("profile.cancel")}
        </Button>
        <Button
          mode="contained"
          onPress={_confirm}
          style={[styles.button, localStyles.button, { backgroundColor: colors.black }]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton, { fontWeight: 'bold' }]}
          disabled={false}
          loading={false}
        >
          {i18n.t("profile.logout")}
        </Button>
      </View>
    </Dialog>
  );
}

export default LogoutModel;
