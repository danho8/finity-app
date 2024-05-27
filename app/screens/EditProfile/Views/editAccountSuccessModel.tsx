import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { modalActionSelector, modalStateSelector } from "app/store";
import styles from "app/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";

const EditAccountSuccessModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsEditAccountSuccessVisible } = useStoreActions(modalActionSelector);
  const { isEditAccountSuccessVisible } = useStoreState(modalStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        textContent: {
          lineHeight: 22,
        },
        title: {
          color: colors.black,
          marginBottom: 25,
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 16,
          right: 12,
          zIndex: 1,
        },
        iconClose: {
          width: 18,
          height: 18,
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
    NavigationService.navigate('ProfileScreen');
    setIsEditAccountSuccessVisible(false);
  }

  return (
    <Dialog
      visible={isEditAccountSuccessVisible}
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
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t("edit_profile.title_model")}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {i18n.t('edit_profile.content_model')}
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
        {i18n.t("edit_profile.confirm")}
      </Button>
    </Dialog>
  );
}

export default EditAccountSuccessModel;
