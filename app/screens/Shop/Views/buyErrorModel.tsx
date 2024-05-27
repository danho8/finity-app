import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { modalActionSelector, modalStateSelector } from "app/store";
import styles from "app/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";

const BuyErrorModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsBuyErrorVisible } = useStoreActions(modalActionSelector);
  const { isBuyErrorVisible } = useStoreState(modalStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 34,
          paddingHorizontal: 32,
          backgroundColor: colors.background,
        },
        textContent: {
          lineHeight: 22,
          textAlign: 'center',
        },
        title: {
          marginBottom: 23,
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 16,
          right: 12,
          zIndex: 1,
        },
        iconClose: {
          width: 20,
          height: 20,
        },
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
          marginBottom: 16,
          width: Dimensions.get('window').width - 50,
        },
        button: {
          width: (Dimensions.get('screen').width - 130) / 2,
          borderRadius: 5,
          marginTop: 30,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
      }),
    []
  );

  const _confirm = async () => {
    NavigationService.navigate('CoinSituationScreen');
    setIsBuyErrorVisible(false);
  }

  const _cancel = () => {
    setIsBuyErrorVisible(false);
  }

  return (
    <Dialog
      visible={isBuyErrorVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}
    >
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_cancel}>
          <Image
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t("shop.notification")}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {i18n.t('shop.content')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          mode="contained"
          onPress={_cancel}
          style={[styles.button, localStyles.button, { backgroundColor: colors.black }]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}
        >
          {i18n.t("shop.cancel")}
        </Button>
        <Button
          mode="contained"
          onPress={_confirm}
          style={[styles.button, localStyles.button, { backgroundColor: colors.primary }]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}
        >
          {i18n.t("shop.buy_to_wallet")}
        </Button>
      </View>
    </Dialog>
  );
}

export default BuyErrorModel;
