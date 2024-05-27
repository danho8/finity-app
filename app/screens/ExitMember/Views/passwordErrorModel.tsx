import i18n from "app/i18n";
import { modalActionSelector, modalStateSelector } from "app/store";
import styles from "app/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";

const PasswordErrorModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsPasswordErrorVisible } = useStoreActions(modalActionSelector);
  const { isPasswordErrorVisible } = useStoreState(modalStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
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
          width: 20,
          height: 20,
          margin: 5
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
    setIsPasswordErrorVisible(false);
  }

  return (
    <Dialog
      visible={isPasswordErrorVisible}
      onDismiss={_confirm}
      dismissable={true}
      style={styles.containerDialog}
    >
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_confirm}>
          <Image
            source={require('../../../assets/images/icon-close-black-model.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.titledialog, localStyles.title, { alignSelf: 'center' }]}>
        {i18n.t("exit_member.title_model")}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {i18n.t('exit_member.content_model')}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_confirm}
        style={[styles.button, localStyles.button, { backgroundColor: colors.black }]}
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

export default PasswordErrorModel;
