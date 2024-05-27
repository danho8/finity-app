import i18n from 'app/i18n';
import {
  authStateSelector,
  authActionSelector,
  modalActionSelector,
  modalStateSelector,
  shopActionSelector,
  shopStateSelector,
} from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Dialog, useTheme } from 'react-native-paper';

const MergeItemModel: React.FC = () => {
  const { colors }: any = useTheme();

  const {
    setMergeItemsVisible,
    setIsSendItemToUserVisible,
    setIsSendItemToUserSuccessVisible,
  } = useStoreActions(modalActionSelector);
  const { isMergeItemsVisible } = useStoreState(modalStateSelector);
  const {
    setCoin,
    getPriceUpgrade,
    setPriceUpgrade,
    setIsProductUpgrade,
    productUpgrade,
  } = useStoreActions(shopActionSelector);
  const { getWallets } = useStoreActions(authActionSelector);
  const { coin, priceUpgrade, isProductUpgrade } =
    useStoreState(shopStateSelector);
  const { wallets } = useStoreState(authStateSelector);
  const data = [...wallets];
  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 19,
          backgroundColor: colors.background,
        },
        textCompositeInformation: {
          marginBottom: 24,
          color: colors.btn_black,
          lineHeight: 30,
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
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
          marginBottom: 16,
        },
        wrapperUpgrade: {
          width: '100%',
          paddingVertical: 13,
          backgroundColor:
            data?.[0]?.amount < priceUpgrade?.matic &&
              data?.[1]?.amount < priceUpgrade?.cft
              ? colors.orange_visible
              : colors.accent,
          justifyContent: 'center',
          alignItems: 'center',
        },
        textTitleUpgrade: {
          marginBottom: 3,
          fontWeight: 'bold',
          color: colors.gold_500,
        },
        textContentUpgrade: {
          lineHeight: 14,
          marginBottom: 5,
          color: colors.text,
        },
        button: {
          width: (Dimensions.get('screen').width - 150) / 2,
          borderRadius: 10,
          marginTop: 18,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
        wrapperInfo: {
          flexDirection: 'row',
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
        item: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 25,
        },
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        checkbox: {
          marginTop: 19,
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
        iconPlus: {
          width: 20,
          height: 20,
          marginLeft: 25,
        },
        wrapperItem: {
          borderBottomColor: colors.border_gray,
          borderBottomWidth: 1,
        },
      }),
    [],
  );

  useEffect(() => {
    getPriceUpgrade({
      product_inventory_id: coin?.id,
    });
  }, []);

  useEffect(() => {
    if (isProductUpgrade) {
      setIsProductUpgrade(false);
      _cancel();
      setIsSendItemToUserVisible(false);
    }
  }, [isProductUpgrade]);
  const _handleUpgrade = async () => {
    if (coin?.level !== 30) {
      await productUpgrade({
        product_inventory_id: coin?.id ,
        coin_id: 1,
      });
      await productUpgrade({
        product_inventory_id: coin?.id ,
        coin_id: 2,
      });
      await getWallets();
    } else {
      setIsSendItemToUserSuccessVisible(true);
    }
  };
  const _cancel = () => {
    setMergeItemsVisible(false);
    setPriceUpgrade(false);
    setCoin(false);
  };

  return (
    <Dialog
      visible={isMergeItemsVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_cancel}>
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
      <Text
        style={[styles.text14Regular, localStyles.textCompositeInformation]}>
        {i18n.t('coin.info_merge_item')}
      </Text>
      <View style={[localStyles.item]}>
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
              width: '62%',
            }}>
            <Text
              style={[
                styles.text14SemiBold,
                {
                  color: colors.black,
                  width: (Dimensions.get('screen').width - 100) / 2,
                },
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
        <View
          style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
          <View style={[styles.button, localStyles.buttonBuy]}>
            <Text style={[styles.text12Bold, localStyles.labelButtonBuy]}>
              {`${i18n.t('shop.lv')}${coin?.level}`}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        disabled={
          data?.[0]?.amount < priceUpgrade?.[0]?.amount &&
          data?.[1]?.amount < priceUpgrade?.[1]?.amount
        }
        onPress={_handleUpgrade}
        style={[styles.button, localStyles.wrapperUpgrade]}>
        <Text style={[styles.text14Regular, localStyles.textTitleUpgrade]}>
          {i18n.t('inventory.upgrade')}
        </Text>
        <Text style={[styles.text12Regular, localStyles.textContentUpgrade]}>
          {i18n.t('MATIC')}: {priceUpgrade?.[0]?.amount}
        </Text>
        <Text style={[styles.text12Regular, localStyles.textContentUpgrade]}>
          {i18n.t('CFT')}: {priceUpgrade?.[1]?.amount}
        </Text>
      </TouchableOpacity>
    </Dialog>
  );
};

export default MergeItemModel;
