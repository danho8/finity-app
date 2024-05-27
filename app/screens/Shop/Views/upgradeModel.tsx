/* eslint-disable no-fallthrough */
import RadioCheckboxGold from 'app/components/RadioCheckboxGold';
import CheckBoxCustomTwo from 'app/components/CheckboxCustomTwo';
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
import { _abbreviateNumber, formatMoneyTow } from 'app/utils/formatString';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Button, Dialog, useTheme } from 'react-native-paper';

const _checkMatic = (valueMatic: any, isConfirmItem: any) => {
  return valueMatic && isConfirmItem;
}

const _checkCFT = (valueCFT: any, isConfirmItem: any) => {
  return valueCFT && isConfirmItem;
}

const _checkIos = (isStatusFunctions: any) => {
  return Platform?.OS == 'ios' && !isStatusFunctions;
}

const UpgradeModel: React.FC = () => {
  const { colors }: any = useTheme();
  const { setIsUpgradeVisible, setIsUpgradeSuccessVisible } =
    useStoreActions(modalActionSelector);
  const { isUpgradeVisible } = useStoreState(modalStateSelector);
  const {
    setCoin,
    productUpgrade,
    setIsProductUpgrade,
    setPriceUpgrade,
    getPriceUpgrade,
  } = useStoreActions(shopActionSelector);
  const { coin, isProductUpgrade, priceUpgrade, isStatusFunctions } =
    useStoreState(shopStateSelector);
  const { wallets } = useStoreState(authStateSelector);
  const { getWallets } = useStoreActions(authActionSelector);
  const [isConfirmItem, setIsConfirmItem] = useState(false);
  const [valueMatic, setValueMatic] = useState(true);
  const [valueCFT, setValueCFT] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 34,
          paddingHorizontal: 15,
          borderRadius: 12,
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
          top: 19,
          right: 17,
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
        wrapperContainer: {
          alignContent: 'center',
          marginTop: 4,
        },
        button: {
          marginBottom: 20,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0,
          shadowColor: colors.transparent,
          width: (Dimensions.get('screen').width - 135) / 2,
          borderRadius: 5,
          marginTop: 38,
        },
        labelButton: {
          textTransform: 'capitalize',
          alignSelf: 'center',
        },
        wrapperInfo: {
          flexDirection: 'row',
        },
        wrapperIconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        item: {
          paddingVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomColor: colors.border_gray,
          borderBottomWidth: 1,
        },
        wrapper: {
          backgroundColor: colors.gray_400,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 15,
          paddingHorizontal: 12,
          width: 34,
          height: 34,
          marginRight: 5,
        },
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        iconCoin: {
          width: 20,
          height: 20,
          marginRight: 10,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        checkbox: {
          marginTop: 15,
        },
        labelBox: {
          color: colors.btn_black,
        },
        checkboxTerms: {
          marginTop: 19,
          width: Dimensions.get('window').width - 120,
        },
        wrapperAction: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 21,
          alignSelf: 'center'
        },
        buttonBuy: {
          backgroundColor: colors.gray_800,
          width: 51,
          height: 20,
          borderRadius: 5,
          justifyContent: 'center'
        },
        textWallets: {
          color: colors.gold_500,
        },
        textUnit: {
          marginTop: 8,
          color: colors.gold_500,
          marginRight: 8,
        },
        textName: {
          width: 33,
          height: 16,
          textAlign: 'center',
          fontSize: 9,
        },
        textNameWallets: {
          color: colors.text_content,
          marginLeft: 8,
          width: 50,
          textAlign: 'right',
          fontWeight: '400',
        },
        labelButtonBuy: {
          textAlign: 'center',
          borderRadius: 5,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          overflow: 'hidden',
          backgroundColor: colors.gray_800,
          color: colors.white,
          fontSize: 13,
          fontWeight: '900',
        },
        wrapperMethod: {
          borderBottomColor: colors.border_gray,
          borderBottomWidth: 1,
          paddingBottom: 15,
        },
      }),
    [],
  );

  useEffect(() => {
    getPriceUpgrade({
      product_inventory_id: coin?.product_inventory
        ? coin?.product_inventory?.[0]?.id
        : coin?.id,
    });
  }, []);

  useEffect(() => {
    if (isProductUpgrade) {
      setPriceUpgrade(false);
      setIsProductUpgrade(false);
      setIsUpgradeVisible(false);
      setIsUpgradeSuccessVisible(true);
    }
  }, [isProductUpgrade]);
  const _handleChooseMatic = () => {
    setValueMatic(true);
    setValueCFT(false);
  };
  const _handleChooseCFT = () => {
    setValueCFT(true);
    setValueMatic(false);
  };
  const _buy = async () => {
    if (_checkIos(isStatusFunctions)) {
      await productUpgrade({
        product_inventory_id: coin?.product_inventory
          ? coin?.product_inventory?.[0]?.id
          : coin?.id,
        coin_id: 1,
      });
      await getWallets();
      return;
    }
    
    if (_checkMatic(valueMatic, isConfirmItem)) {
      const checkData =
        Number(wallets?.[0]?.amount) > Number(priceUpgrade?.amount);
      switch (checkData) {
        case checkData:
          await productUpgrade({
            product_inventory_id: coin?.product_inventory
              ? coin?.product_inventory?.[0]?.id
              : coin?.id,
            coin_id: 1,
          });
          await getWallets();
          break;
        case !checkData:
          setPriceUpgrade(false);
          setIsProductUpgrade(false);
          setCoin(false);
          break;
      }
    }
    if (_checkCFT(valueCFT, isConfirmItem)) {
      const checkData =
        Number(wallets?.[1]?.amount) > Number(priceUpgrade?.amount);
      switch (checkData) {
        case checkData:
          await productUpgrade({
            product_inventory_id: coin?.product_inventory
              ? coin?.product_inventory?.[0]?.id
              : coin?.id,
            coin_id: 2,
          });
          await getWallets();
          break;
        case !checkData:
          setPriceUpgrade(false);
          setIsProductUpgrade(false);
          setCoin(false);
          break;
      }
    }
  };
  const _cancel = () => {
    setIsUpgradeVisible(false);
    setCoin(false);
  };

  return (
    <Dialog
      visible={isUpgradeVisible}
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
      <Text style={[styles.titledialog, localStyles.title]}>
        {i18n.t('shop.upgrade')}
      </Text>
      <Text style={[styles.text14Regular]}>{i18n.t('shop.title_coin')}</Text>
      <View style={[localStyles.item]}>
        <View style={[localStyles.wrapperInfo, { flex: 1.5 }]}>
          <View style={[localStyles.wrapperIconBitcoin]}>
            <FastImage
              source={{ uri: coin?.image_url || coin?.product?.image_url }}
              style={[styles.boxImage, localStyles.iconBitcoin]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text
              numberOfLines={1}
              style={[styles.text14SemiBold, { color: colors.black }]}>
              {coin?.name_glass || coin?.product?.name_glass}
            </Text>
            <Text style={[styles.text12Regular, { marginTop: 4 }]}>
              {coin?.description || coin?.product?.description}
            </Text>
            {(Platform?.OS != 'ios' || isStatusFunctions) && (
              <View>
                <View style={[styles.row, localStyles.wrapperContainer]}>
                  <View style={[styles.button, localStyles.wrapper]}>
                    <Text style={[styles.text12SemiBold, localStyles.textName]}>
                      {priceUpgrade?.[0]?.unit}
                    </Text>
                  </View>
                  <Text style={[styles.text14SemiBold, localStyles.textUnit]}>
                    {_abbreviateNumber(priceUpgrade?.[0]?.amount)}{' '}
                    {priceUpgrade?.[0]?.unit}
                  </Text>
                </View>
              </View>
            )

            }
            {(Platform?.OS != 'ios' || isStatusFunctions) && (
              <View>
                <View style={[styles.row, localStyles.wrapperContainer]}>
                  <View style={[styles.button, localStyles.wrapper]}>
                    <Text style={[styles.text12SemiBold, localStyles.textName]}>
                      {priceUpgrade?.[1]?.unit}
                    </Text>
                  </View>
                  <Text style={[styles.text14SemiBold, localStyles.textUnit]}>
                    {_abbreviateNumber(priceUpgrade?.[1]?.amount)}{' '}
                    {priceUpgrade?.[1]?.unit}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={localStyles.buttonBuy}>
          <Text style={localStyles.labelButtonBuy}>
            {`${i18n.t('shop.lv')}${coin?.product_inventory
              ? coin?.product_inventory?.[0]?.level
              : coin?.level
              }`}
          </Text>
        </View>
      </View>
      {(Platform?.OS != 'ios' || isStatusFunctions) && (
        <View style={[localStyles.wrapperMethod]}>
          <Text style={[styles.text14Regular, { marginTop: 18 }]}>
            {i18n.t('shop.method_pay')}
          </Text>
          <View>
            <View style={[localStyles.row, { justifyContent: 'space-between' }]}>
              <RadioCheckboxGold
                textContent={i18n.t('shop.coin_pay_checkbox')}
                value={valueMatic}
                changeValue={_handleChooseMatic}
                space={10}
                isReverse={false}
                labelStyle={[localStyles.labelBox]}
                style={[localStyles.checkbox]}
              />
              <View style={[localStyles.row, { marginTop: 18 }]}>
                <Text style={[styles.text14SemiBold, localStyles.textWallets]}>
                  {wallets?.[0]?.amount < 1
                    ? formatMoneyTow(wallets?.[0]?.amount)
                    : _abbreviateNumber(wallets?.[0]?.amount)}
                </Text>
                <Text
                  style={[styles.text14SemiBold, localStyles.textNameWallets]}>
                  {priceUpgrade?.[0]?.unit}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <View style={[localStyles.row, { justifyContent: 'space-between' }]}>
              <RadioCheckboxGold
                textContent={i18n.t('shop.coin_pay_checkbox')}
                value={valueCFT}
                changeValue={_handleChooseCFT}
                space={10}
                isReverse={false}
                labelStyle={[localStyles.labelBox]}
                style={[localStyles.checkbox]}
              />
              <View style={[localStyles.row, { marginTop: 18 }]}>
                <Text style={[styles.text14SemiBold, localStyles.textWallets]}>
                  {wallets?.[0]?.amount < 1
                    ? formatMoneyTow(wallets?.[1]?.amount)
                    : _abbreviateNumber(wallets?.[1]?.amount)}
                </Text>
                <Text
                  style={[styles.text14SemiBold, localStyles.textNameWallets]}>
                  {priceUpgrade?.[1]?.unit}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {(Platform?.OS != 'ios' || isStatusFunctions) && (
        <View>
          <Text
            style={[styles.text14Regular, { marginTop: 18, marginBottom: 8 }]}>
            {i18n.t('shop.terms_and_conditions')}
          </Text>
          <CheckBoxCustomTwo
            value={isConfirmItem}
            changeValue={() => setIsConfirmItem(!isConfirmItem)}
            space={10}
            isReverse={false}
            textContent={i18n.t('shop.text_agreement')}
          />
          <Text
            style={[
              styles.text14Regular,
              { textAlign: 'center', marginTop: 22 },
            ]}>
            {i18n.t('shop.text_upgrade')}
          </Text>
        </View>
      )}
      <View style={[localStyles.wrapperAction]}>
        <Button
          mode="contained"
          onPress={_cancel}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.gold_500, marginRight: 15 },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('shop.cancel')}
        </Button>
        <Button
          mode="contained"
          onPress={_buy}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.black },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('shop.upgrade')}
        </Button>
      </View>
    </Dialog>
  );
};
export default UpgradeModel;
