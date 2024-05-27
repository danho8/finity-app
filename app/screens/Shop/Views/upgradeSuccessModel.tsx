import i18n from 'app/i18n';
import {
  modalActionSelector,
  modalStateSelector,
  shopActionSelector,
  shopStateSelector,
} from 'app/store';
import styles from 'app/styles';
import FastImage from 'react-native-fast-image';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';

const UpgradeSuccessModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsUpgradeSuccessVisible } = useStoreActions(modalActionSelector);
  const { isUpgradeSuccessVisible } = useStoreState(modalStateSelector);
  const { setCoin } = useStoreActions(shopActionSelector);
  const { coin } = useStoreState(shopStateSelector);
  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        textContent: {
          lineHeight: 22,
        },
        title: {
          marginBottom: 17,
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
          borderRadius: 10,
          marginTop: 30,
          marginHorizontal: 89,
          width: 150,
          alignSelf: 'center',
          marginBottom: 18,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
        iconBitcoin: {
          width: 120,
          height: 120,
          alignSelf: 'center',
          borderRadius: 10,
          marginTop: 34,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        buttonBuy: {
          backgroundColor: colors.gray_800,
          width: 51,
          height: 20,
          borderRadius: 5,
        },
        labelButtonBuy: {
          backgroundColor: colors.gray_800,
          color: colors.white,
          textAlign: 'center',
          height: 20,
          borderRadius: 5,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          overflow: 'hidden',
        },
        iconUpgrade: {
          marginHorizontal: 13,
          width: 8,
          height: 8,
          top: 8,
        },
      }),
    [],
  );

  const _cancel = () => {
    setIsUpgradeSuccessVisible(false);
    setCoin(false);
  };
  return (
    <Dialog
      visible={isUpgradeSuccessVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity
          onPress={() => {
            setIsUpgradeSuccessVisible(false);
            setCoin(false);
          }}>
          <FastImage
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t('shop.upgrade_success')}
      </Text>
      <Text
        style={[
          styles.text14Regular,
          { textAlign: 'center', marginVertical: 14 },
        ]}>
        {i18n.t('shop.content_upgrade_success')}
      </Text>
      <FastImage
        source={{ uri: coin?.image_url || coin?.product?.image_url }}
        style={[styles.boxImage, localStyles.iconBitcoin]}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View
        style={[
          styles.row,
          { justifyContent: 'center', marginTop: 36, alignItems: 'center' },
        ]}>
        <View style={[styles.button, localStyles.buttonBuy]}>
          <Text style={[styles.text12Bold, localStyles.labelButtonBuy]}>
            {`${i18n.t('shop.lv')}${
              coin?.product_inventory
                ? coin?.product_inventory?.[0]?.level
                : coin?.level
            }`}
          </Text>
        </View>
        <FastImage
          source={require('../../../assets/images/icon-upgrade.png')}
          style={localStyles.iconUpgrade}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={[styles.button, localStyles.buttonBuy]}>
          <Text style={[styles.text12Bold, localStyles.labelButtonBuy]}>
            {`${i18n.t('shop.lv')}${
              coin?.product_inventory
                ? coin?.product_inventory?.[0]?.level + 1
                : coin?.level + 1
            }`}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.text14,
          { textAlign: 'center', marginTop: 16, color: colors.black },
        ]}>
        {coin?.name_glass || coin?.product?.name_glass}
      </Text>
      <Button
        mode="contained"
        onPress={_cancel}
        style={[
          styles.button,
          localStyles.button,
          { backgroundColor: colors.black },
        ]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={false}
        loading={false}>
        {i18n.t('shop.confirm')}
      </Button>
    </Dialog>
  );
};

export default UpgradeSuccessModel;
