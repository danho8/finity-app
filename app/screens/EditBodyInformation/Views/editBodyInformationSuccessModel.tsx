import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import {
  modalActionSelector,
  modalStateSelector,
  authStateSelector,
  authActionSelector,
} from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';

const EditBodyInformationSuccessModel: React.FC = () => {
  const { colors }: any = useTheme();
  const { isTheFirstUpdateInformation } = useStoreState(authStateSelector);
  const { isEditBodyInformationVisible, isEditBodyInformationFirstVisible } = useStoreState(modalStateSelector);
  const { setIsEditBodyInformationVisible, setIsEditBodyInformationFirstVisible } =
    useStoreActions(modalActionSelector);
  const { setIsTheFirstUpdateInformation } =
    useStoreActions(authActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 32.5,
          backgroundColor: colors.background,
          elevation: 4,
          shadowOffset: { width: 0, height: 4 },
          shadowColor: colors.shadow_color,
        },
        textContent: {
          width: 400,
          lineHeight: 22,
          textAlign: 'center',
        },
        title: {
          marginTop: 5,
          marginBottom: 29,
          lineHeight: 19,
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 19,
          right: 17.01,
          zIndex: 1,
        },
        iconClose: {
          width: 17.99,
          height: 18,
        },
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
        },
        button: {
          marginHorizontal: 56.5,
          marginTop: 36,
          backgroundColor: colors.btn_black,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: Platform.OS == 'ios' ? 10.5 : 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
      }),
    [],
  );

  const _confirm = () => {
    setIsEditBodyInformationVisible(false);
    setIsEditBodyInformationFirstVisible(false);
    if (isTheFirstUpdateInformation) {
      NavigationService.navigate('GoRiceScreen');
      setIsTheFirstUpdateInformation(false);
    } else {
      NavigationService.navigate('ProfileScreen');
    }
  };

  return (
    <Dialog
      visible={isEditBodyInformationVisible || isEditBodyInformationFirstVisible}
      onDismiss={_confirm}
      dismissable={true}
      style={[localStyles.container]}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_confirm}>
          <Image
            source={require('../../../assets/images/icon-close-new.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.text16Bold,
          localStyles.title,
          { fontWeight: '400', alignSelf: 'center' },
        ]}>
        {isEditBodyInformationFirstVisible
          ? i18n.t('edit_bodyInformation_success.edit_bodyInformation_success_first')
          : i18n.t('edit_bodyInformation_success.edit_bodyInformation_success')
        }
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {isEditBodyInformationFirstVisible
          ? i18n.t('edit_bodyInformation_success.content_text_first')
          : i18n.t('edit_bodyInformation_success.content_text')
        }
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_confirm}
        style={[styles.button, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={false}
        loading={false}>
        {i18n.t('edit_bodyInformation_success.confirm')}
      </Button>
    </Dialog>
  );
};

export default EditBodyInformationSuccessModel;
