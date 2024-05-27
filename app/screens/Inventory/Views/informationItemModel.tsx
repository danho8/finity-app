import i18n from 'app/i18n';
import {
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
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Dialog, useTheme } from 'react-native-paper';

const InformationItemModel: React.FC = () => {
  const { colors }: any = useTheme();
  const {
    setIsInformationItemVisible,
    setIsUpgradeVisible,
    setIsSendItemToUserVisible,
  } = useStoreActions(modalActionSelector);
  const { isInformationItemVisible } = useStoreState(modalStateSelector);
  const { setCoin, getPriceUpgrade, setPriceUpgrade, setIsProductUpgrade } =
    useStoreActions(shopActionSelector);
  const { coin, priceUpgrade, isProductUpgrade, isStatusFunctions } =
    useStoreState(shopStateSelector);

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
        textContentInformation: {
          lineHeight: 14,
          color: colors.border_input_gray,
        },
        title: {
          fontWeight: '400',
          marginTop: 5,
          lineHeight: 19,
          marginBottom: 17,
          alignSelf: 'center',
          color: colors.btn_black,
          fontSize: 16,
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
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
          marginBottom: 16,
        },
        button: {
          width: (Dimensions.get('screen').width - 150) / 2,
          borderRadius: 10,
          marginTop: 38,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: 8,
          marginTop: 5,
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
          justifyContent: 'space-around',
        },
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        buttonBuy: {
          backgroundColor: colors.gray_800,
          width: 51,
          height: 20,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
        },
        labelButtonBuy: {
          lineHeight: 14,
          color: colors.white,
        },
        textCompositeInformation: {
          marginBottom: 24,
          color: colors.btn_black,
          lineHeight: 30,
        },
        wrapperUpgrade: {
          width: '100%',
          paddingVertical: 13,
          backgroundColor:
            coin?.level == 30 || coin?.product_inventory?.[0]?.level
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
          fontWeight: '400',
          lineHeight: 14,
          color: colors.border_input_gray,
        },
        iconUpgrade: {
          marginHorizontal: 13,
          width: 13.5,
          height: 12,
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
    }
  }, [isProductUpgrade]);

  const _cancel = () => {
    setIsInformationItemVisible(false);
    setCoin(false);
    setPriceUpgrade(false);
  };

  const _handleUpgrade = async () => {
    if (coin?.level != 30) {
      setIsUpgradeVisible(true);
      setPriceUpgrade(false);
      setIsInformationItemVisible(false);
    }
  };

  const _sendItem = () => {
    setIsSendItemToUserVisible(true);
    setIsInformationItemVisible(false);
  };

  return (
    <Dialog
      visible={isInformationItemVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={localStyles.container}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_cancel}>
          <FastImage
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t('inventory.info_item')}
      </Text>
      <Text
        style={[styles.text14Regular, localStyles.textCompositeInformation]}>
        {i18n.t('inventory.item_composite_information')}
      </Text>
      <View style={[localStyles.item, { marginBottom: 25 }]}>
        <View style={[localStyles.wrapperInfo]}>
          <View style={[localStyles.wrapperIconBitcoin]}>
            <FastImage
              source={
                coin?.image_url
                  ? { uri: coin?.image_url }
                  : { uri: coin?.product?.image_url }
              }
              style={[styles.boxImage, localStyles.iconBitcoin]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={{ marginLeft: 12, width: '62%' }}>
            <Text
              style={[
                styles.text14Regular,
                {
                  fontWeight: 'bold',
                  color: colors.btn_black,
                  width: (Dimensions.get('screen').width - 100) / 2,
                },
              ]}>
              {coin?.product_inventory?.[0]
                ? coin?.product_inventory?.[0]?.product_inventory_name
                : coin?.product_inventory_name}
            </Text>
            <Text
              style={[
                styles.text12Regular,
                localStyles.textContentInformation,
                { marginTop: 1 },
              ]}>
              {coin?.product?.description
                ? coin?.product?.description
                : coin?.description}
            </Text>
            <Text
              style={[
                styles.text12Regular,
                localStyles.textContentInformation,
                { marginTop: 4 },
              ]}>
              {i18n.t('inventory.mining')} :{' '}
              {coin?.mining ? coin?.mining : coin?.product?.mining}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.button,
            localStyles.buttonBuy,
            {
              display: (Platform?.OS != 'ios' || isStatusFunctions) ? 'flex' : 'none',
            }
          ]}
        >
          <Text
            style={[
              styles.text12Regular,
              localStyles.labelButtonBuy,
              {
                backgroundColor: colors.gray_800,
              },
            ]}>
            {i18n.t('shop.lv')}
            {coin?.product_inventory?.[0]
              ? coin?.product_inventory[0]?.level
              : coin?.level}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={
          coin?.level == 30 || coin?.product_inventory?.[0]?.level == 30
        }
        onPress={_handleUpgrade}
        style={[
          styles.button,
          localStyles.wrapperUpgrade,
          { display: (Platform?.OS != 'ios' || isStatusFunctions) ? 'flex' : 'none'}
        ]}>
        <Text style={[styles.text14Regular, localStyles.textTitleUpgrade]}>
          {i18n.t('inventory.upgrade')}
        </Text>
        <View>
          <Text
            style={[
              styles.text12Regular,
              localStyles.textContentUpgrade,
              { marginBottom: 3 },
            ]}>
            {i18n.t('MATIC')} :{' '}
            {coin?.product_inventory?.[0]
              ? coin?.product_inventory?.[0]?.product_upgrade?.[0]?.amount
              : priceUpgrade?.[0]?.amount}
          </Text>
          <Text style={[styles.text12Regular, localStyles.textContentUpgrade]}>
            {i18n.t('CFT')} :{' '}
            {coin?.product_inventory?.[0]
              ? coin?.product_inventory?.[0]?.product_upgrade?.[1]?.amount
              : priceUpgrade?.[1]?.amount}
          </Text>
        </View>
      </TouchableOpacity>
    </Dialog>
  );
};

export default InformationItemModel;
