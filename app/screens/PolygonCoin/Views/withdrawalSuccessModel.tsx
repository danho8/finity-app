import i18n from "app/i18n";
import { modalActionSelector, modalStateSelector } from "app/store";
import styles from "app/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";

const WithdrawalSuccessModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsWithdrawalSuccessVisible } = useStoreActions(modalActionSelector);
  const { isWithdrawalSuccessVisible } = useStoreState(modalStateSelector);

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
          width: 28,
          height: 28,
        },
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
          marginBottom: 16,
        },
        button: {
          marginHorizontal: 79,
          borderRadius: 10,
          marginTop: 27,
          width: 150,
          alignSelf: 'center',
        },
        labelButton: {
          textTransform: 'capitalize',
        },
      }),
    []
  );

  const _confirm = () => {
    setIsWithdrawalSuccessVisible(false);
  }

  return (
    <Dialog
      visible={isWithdrawalSuccessVisible}
      onDismiss={_confirm}
      dismissable={true}
      style={[localStyles.container]}
    >
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_confirm}>
          <Image
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title, { alignSelf: 'center' }]}>
        {i18n.t("polygon_coin.title_model")}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {i18n.t('polygon_coin.content_model')}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_confirm}
        style={[styles.button, localStyles.button, { backgroundColor: colors.gold_500 }]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={false}
        loading={false}
      >
        {i18n.t("exit_member.confirm")}
      </Button>
    </Dialog>
  );
}

export default WithdrawalSuccessModel;
