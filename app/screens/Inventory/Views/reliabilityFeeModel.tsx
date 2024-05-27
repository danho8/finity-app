import i18n from 'app/i18n';
import {
  modalActionSelector,
  modalStateSelector,
  shopActionSelector,
  shopStateSelector,
} from 'app/store';
import styles from 'app/styles';
import { _abbreviateNumber, formatMoney } from 'app/utils/formatString';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Button, Dialog, useTheme } from 'react-native-paper';

const ReliabilityFeeModel: React.FC = () => {
  const { colors }: any = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const { setIsReliabilityFeeVisible, setIsReliabilityFeeSuccessVisible, setIsInformationItemVisible,
    setIsUpgradeVisible } =
    useStoreActions(modalActionSelector);
  const { isReliabilityFeeVisible } = useStoreState(modalStateSelector);
  const { setCoin, getRepairFees, repair, setIsRepair, setPriceUpgrade, getPriceUpgrade } =
    useStoreActions(shopActionSelector);
  const { coin, isRepair, repairFees, priceUpgrade, isStatusFunctions } = useStoreState(shopStateSelector);
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
          height: 40,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 16,
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
        },
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        checkbox: {
          marginTop: 19,
        },
        wrapperAction: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 38,
          marginHorizontal: 12,
        },
        buttonBuy: {
          backgroundColor: colors.GRAY_800,
          width: 51,
          height: 20,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
        },
        labelButtonBuy: {
          color: colors.btn_black,
          fontWeight: 'bold',
        },
        wrapperMethod: {
          borderBottomColor: colors.border_gray,
          borderBottomWidth: 1,
          paddingBottom: 15,
        },
        wrapperUpgrade: {
          width: '100%',
          paddingVertical: 13,
          backgroundColor:
            coin?.level == 30 ? colors.orange_lv_max : colors.accent,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 44,
        },
        textCompositeInformation: {
          marginBottom: 24,
          color: colors.btn_black,
          lineHeight: 30,
        },
        titleUseCoin: {
          marginBottom: 12,
          textAlign: 'center',
          color: colors.btn_black,
          lineHeight: 30,
        },
        iconCoin: {
          width: 20,
          height: 20,
          marginHorizontal: 22,
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
      }),
    [],
  );

  useEffect(() => {
    getRepairFees({
      id: coin?.id,
    });
    getPriceUpgrade({
      product_inventory_id: coin?.id,
    });
  }, []);

  useEffect(() => {
    if (isRepair) {
      setIsRepair(false);
      setIsReliabilityFeeVisible(false);
      setIsReliabilityFeeSuccessVisible(true);
    }
  }, [isRepair]);

  const _repair = async () => {
    setIsLoading(true);
    await repair({
      product_inventory_id: coin?.id,
    });
    setIsLoading(false);
  };

  const _cancel = () => {
    setIsReliabilityFeeVisible(false);
    setCoin(false);
  };

  const _handleUpgrade = async () => {
    if (coin?.level != 30) {
      setIsReliabilityFeeVisible(false);
      setIsUpgradeVisible(true);
      setPriceUpgrade(false);
      setIsInformationItemVisible(false);
    }
  };

  return (
    <Dialog
      visible={isReliabilityFeeVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}>
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
        {i18n.t('inventory.structural_repair')}
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
                coin?.product?.image_url
                  ? { uri: coin?.product?.image_url }
                  : require('../../../assets/images/icon-bike.png')
              }
              style={[styles.boxImage, localStyles.iconBitcoin]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={{ marginLeft: 12, width: '64%' }}>
            <Text
              style={[
                styles.text14Regular,
                { fontWeight: 'bold', color: colors.btn_black },
              ]}>
              {coin?.product_inventory_name}
            </Text>
            <Text
              style={[
                styles.text12Regular,
                {
                  marginTop: 1,
                  lineHeight: 14,
                  color: colors.border_input_gray,
                },
              ]}>
              {coin?.product?.description}
            </Text>
          </View>
        </View>
        <Text style={[styles.text14Regular, localStyles.labelButtonBuy]}>
          {i18n.t('shop.repair_characters')}
        </Text>
      </View>
      <Text style={[styles.text14Regular, localStyles.titleUseCoin]}>
        {i18n.t('inventory.use_coin_repair')}
      </Text>
      {(Platform?.OS != 'ios' || isStatusFunctions) && (
        <View
          style={{
            marginBottom: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.text14Regular, { lineHeight: 30, flex: 1, textAlign: 'right' }]}>
            {i18n.t('inventory.repair_cost')}
          </Text>
          <FastImage
            source={require('../../../assets/images/icon-coin-gold.png')}
            resizeMode={FastImage.resizeMode.cover}
            style={localStyles.iconCoin}
          />
          <Text style={[styles.text14Regular, { lineHeight: 30, flex: 1 }]}>
            {repairFees && Number(repairFees[2]?.amount < 1000)
              ? formatMoney(repairFees[2]?.amount)
              : _abbreviateNumber(Number(repairFees[2]?.amount))
            } {i18n.t('CFT')}
          </Text>
        </View>
      )}
      <TouchableOpacity
        disabled={
          coin?.level == 30 || coin?.product_inventory?.[0]?.level == 30
        }
        onPress={_handleUpgrade}
        style={[styles.button, localStyles.wrapperUpgrade]}>
        <Text style={[styles.text14Regular, localStyles.textTitleUpgrade]}>
          {i18n.t('inventory.upgrade')}
        </Text>
        {(Platform?.OS != 'ios' || isStatusFunctions) && (
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
        )}
      </TouchableOpacity>
      <View style={[localStyles.wrapperAction]}>
        <Button
          mode="contained"
          onPress={_cancel}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.gold_500 },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('shop.cancel')}
        </Button>
        <Button
          mode="contained"
          onPress={_repair}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.btn_black },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={false}>
          {i18n.t('inventory.fix')}
        </Button>
      </View>
    </Dialog>
  );
};

export default ReliabilityFeeModel;
