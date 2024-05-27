import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import {
  homeStateSelector,
  modalActionSelector,
  modalStateSelector,
  shopActionSelector,
} from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';

const ItemDamageGuideModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsSettingVisible } = useStoreActions(modalActionSelector);
  const { isSettingVisible } = useStoreState(modalStateSelector);
  const { setCoin } = useStoreActions(shopActionSelector);
  const { dataGoRiceStart } = useStoreState(homeStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 34,
          paddingHorizontal: 32,
          backgroundColor: colors.background,
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
          width: 18,
          height: 18,
        },
        button: {
          width: 150,
          borderRadius: 10,
          marginTop: 15,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
        wrapperInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        item: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
        },
        wrapperAction: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 21,
        },
      }),
    [],
  );

  const _cancel = () => {
    setIsSettingVisible(false);
    setCoin(false);
  };
  const _submit = async () => {
    _cancel();
    NavigationService.navigate(i18n.t('tab_navigator.inventory'), {
      unUsable: true,
    });
  };

  return (
    <Dialog
      visible={isSettingVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}>
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
        {i18n.t('coin_service.title')}
      </Text>
      <View style={[localStyles.item]}>
        <View style={[localStyles.wrapperInfo]}>
          <Text
            style={[
              styles.text14Regular,
              { textAlign: 'center', marginBottom: 21 },
            ]}>
            {i18n.t('coin_service.content', {
              itemName: dataGoRiceStart?.product,
            })}
          </Text>
        </View>
      </View>
      <View style={[localStyles.wrapperAction]}>
        <Button
          mode="contained"
          onPress={_submit}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.btn_black },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('coin_service.confirm')}
        </Button>
      </View>
    </Dialog>
  );
};

export default ItemDamageGuideModel;
