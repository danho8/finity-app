import i18n from "app/i18n";
import { modalActionSelector, modalStateSelector, shopActionSelector } from "app/store";
import styles from "app/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";

const ReliabilityFeeSuccessModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsReliabilityFeeSuccessVisible } = useStoreActions(modalActionSelector);
  const { isReliabilityFeeSuccessVisible } = useStoreState(modalStateSelector);
  const { setCoin } = useStoreActions(shopActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 18.5,
          backgroundColor: colors.background,
        },
        textContent: {
          lineHeight: 22,
        },
        title: {
          fontWeight: '400',
          marginTop: 5,
          lineHeight: 19,
          marginBottom: 32,
          alignSelf: 'center',
          color: colors.btn_black,
          fontSize: 16
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 19,
          right: 17,
          zIndex: 1,
        },
        iconClose: {
          width: 17.99,
          height: 18,
        },
        button: {
          marginHorizontal: 89,
          width: 150,
          alignSelf: 'center',
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
        iconBitcoin: {
          width: 100,
          height: 100,
          alignSelf: 'center',
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        buttonBuy: {
          backgroundColor: colors.yellow,
          width: 51,
          height: 20,
          borderRadius: 5,
        },
        labelButtonBuy: {
          textAlign: 'center',
          textTransform: 'capitalize',
        },
        iconUpgrade: {
          marginHorizontal: 13,
          width: 13.5,
          height: 12,
        },
      }),
    []
  );

  const _edit = () => {
    setIsReliabilityFeeSuccessVisible(false);
    setCoin(false);
  }

  return (
    <Dialog
      visible={isReliabilityFeeSuccessVisible}
      onDismiss={_edit}
      dismissable={true}
      style={[styles.boxLogin, localStyles.container]}
    >
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_edit}>
          <Image
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t("inventory.structural_repair_success")}
      </Text>
      <Text style={[styles.text14Regular, { textAlign: 'center', marginBottom: 35, lineHeight: 30 }]}>
        {i18n.t("inventory.content_structural_repair_success", { durability: 100 })}
      </Text>
      <Button
        mode="contained"
        onPress={_edit}
        style={[styles.button, localStyles.button, { backgroundColor: colors.btn_black }]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={false}
        loading={false}
      >
        {i18n.t("inventory.confirm")}
      </Button>
    </Dialog>
  );
}

export default ReliabilityFeeSuccessModel;
