import NavigationService from 'app/navigation/NavigationService';
import i18n from 'app/i18n';
import {
  modalActionSelector,
  modalStateSelector,
  shopStateSelector,
  shopActionSelector,
} from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
const SendItemSuccessModel: React.FC = () => {
  const { colors }: any = useTheme();

  const {
    setIsSendItemToUserSuccessVisible,
    setMergeItemsVisible,
    setLoadingVisible,
  } = useStoreActions(modalActionSelector);
  const [isLoading, setIsLoading] = useState(false);
  const { isSendItemToUserSuccessVisible } = useStoreState(modalStateSelector);
  const { setCoin } = useStoreActions(shopActionSelector);
  const { coin } = useStoreState(shopStateSelector);
  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 19,
          backgroundColor: colors.background,
        },
        textContent: {
          lineHeight: 22,
        },
        item: {
          flexDirection: 'row',
          justifyContent: 'space-between',
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
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        wrapperContent: {
          marginBottom: 16,
        },
        wrapperInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        wrapperIconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
          justifyContent: 'center',
          alignItems: 'center',
        },
        buttonBuy: {
          backgroundColor: colors.gray_800,
          width: 51,
          height: 20,
          borderRadius: 5,
        },
        labelButtonBuy: {
          textAlign: 'center',
          height: 20,
          borderRadius: 5,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          overflow: 'hidden',
          backgroundColor: colors.gray_800,
          color: colors.white,
        },
        button: {
          marginHorizontal: 79,
          borderRadius: 10,
          width: '100%',
          marginBottom: 11,
          alignSelf: 'center',
          backgroundColor: colors.blue,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
      }),
    [],
  );
  useEffect(() => {
    setLoadingVisible(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoadingVisible(false);
    }, 1);
  }, []);
  const _confirm = () => {
    NavigationService.navigate(i18n.t('tab_navigator.shop'));
    setIsSendItemToUserSuccessVisible(false);
    setMergeItemsVisible(false);
    setCoin(false);
  };
  return (
    <Dialog
      visible={isSendItemToUserSuccessVisible}
      onDismiss={_confirm}
      dismissable={true}
      style={[localStyles.container]}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_confirm}>
          <FastImage
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t('coin.merge_item')}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          {i18n.t('coin.info_merge_item')}
        </Text>
      </View>
      <View style={[localStyles.item, { marginBottom: 25 }]}>
        <View style={[localStyles.wrapperInfo]}>
          <View style={[localStyles.wrapperIconBitcoin]}>
            <FastImage
              source={
                coin?.product?.image_url
                  ? { uri: coin?.product?.image_url }
                  : require('../../../assets/images/GL1.png')
              }
              style={[localStyles.iconBitcoin]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View
            style={{
              marginLeft: 12,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.text14SemiBold,
                { color: colors.black, width: '95%' },
              ]}>
              {coin.product_inventory_name}
            </Text>
            <Text style={[styles.text12Regular, { marginTop: 4 }]}>
              {coin.product?.description}
            </Text>
            <Text style={[styles.text12Regular, { marginTop: 4 }]}>
              {i18n.t('mining-amount')}: {coin.product?.mining}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <View style={[styles.button, localStyles.buttonBuy]}>
            <Text style={[styles.text12Bold, localStyles.labelButtonBuy]}>
              {`${i18n.t('shop.lv')}${coin?.level}`}
            </Text>
          </View>
        </View>
      </View>
      <Button
        mode="contained"
        onPress={_confirm}
        style={[styles.button, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={false}
        loading={isLoading}>
        {i18n.t('edit_profile.btn_highest_level')}
      </Button>
    </Dialog>
  );
};

export default SendItemSuccessModel;
