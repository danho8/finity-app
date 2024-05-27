import CheckBoxCustomTwo from "app/components/CheckboxCustomTwo";
import RadioCheckboxGold from "app/components/RadioCheckboxGold";
import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { authActionSelector, authStateSelector, modalActionSelector, modalStateSelector, shopActionSelector, shopStateSelector } from "app/store";
import styles from "app/styles";
import { _abbreviateNumber, formatMoneyTow } from "app/utils/formatString";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { Button, Dialog, useTheme } from "react-native-paper";

const BuyModel: React.FC = () => {
  const { colors }: any = useTheme();
  const { setIsBugVisible, setIsBuyErrorVisible } = useStoreActions(modalActionSelector);
  const { isBuyVisible } = useStoreState(modalStateSelector);
  const { setCoin, buyProduct, setIsBuyProduct } = useStoreActions(shopActionSelector);
  const { coin, isBuyProduct, isStatusFunctions } = useStoreState(shopStateSelector);
  const { getWallets } = useStoreActions(authActionSelector);
  const { wallets } = useStoreState(authStateSelector);
  const [coinPay, setCoinPay] = useState<any>();
  const [isCondition, setIsCondition] = useState(false);
  const [getCoisPriceMatic] = useState<any>(wallets?.[0]?.amount);
  const [getCoisPriceCTF] = useState<any>(wallets?.[1]?.amount);
  const isCheckIos = (Platform?.OS != 'ios' || isStatusFunctions);
  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 34,
          paddingHorizontal: 11,
          backgroundColor: colors.background
        },
        textContent: {
          lineHeight: 22
        },
        title: {
          marginBottom: 14,
          alignSelf: 'center'
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 16,
          right: 12,
          zIndex: 1
        },
        iconClose: {
          width: 20,
          height: 20,
        },
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
          marginBottom: 16
        },
        button: {
          width: (Dimensions.get('screen').width - 130) / 2,
          marginTop: 15
        },
        labelButton: {
          textTransform: 'capitalize'
        },
        wrapperInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between'
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
          paddingVertical: 18,
          flexDirection: 'row',
          borderBottomColor: colors.backgroundContent,
          borderBottomWidth: 1
        },
        itemTow: {
          borderBottomColor: colors.backgroundContent,
          borderBottomWidth: 1,
          paddingTop: 10
        },
        itemUnit: {
          width: 35,
          height: 35,
          margin: 1,
          borderRadius: 24,
          backgroundColor: colors.gray_400
        },
        textUnit: {
          fontSize: 10,
          fontWeight: 'bold',
          position: 'absolute',
          alignSelf: 'center',
          paddingVertical: "28%",
          color: colors.gray_800
        },
        textUnitTow: {
          textAlign: 'center',
          fontWeight: 'bold',
          color: colors.black
        },
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        iconCoin: {
          width: 24,
          height: 24
        },
        textPrice: {
          color: colors.primary,
          paddingVertical: 12,
          marginLeft: 5
        },
        wallets: {
          color: colors.primary,
          fontSize: 14,
          fontWeight: '700',
          marginRight: 5
        },
        walletsAll: {
          marginVertical: 5,
          position: 'absolute',
          right: 0
        },
        wrapperAction: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 21
        },
        text12: {
          marginTop: 4,
          marginRight: 20,
          color: colors.hint
        },
        checkBox: {
          marginTop: 10,
          marginBottom: 2
        }
      }),
    []
  );

  useEffect(() => {
    setCoinPay(coin?.prices[0]);
  }, [])

  useEffect(() => {
    if (isBuyProduct) {
      NavigationService.navigate('BuyItemSuccessScreen');
      setIsBuyProduct(false);
      setIsBugVisible(false);
      setCoin(false);
      setIsCondition(false)
    }
  }, [isBuyProduct])

  const _handleChooseCoinPay = (item: any) => {
    !coinPay ? setCoinPay(!item) : setCoinPay(item);
  }

  const _handleCondition = () => {
    if (isCondition) {
      setIsCondition(false);
    } else {
      setIsCondition(true);
    }
  }

  const getApiBuyProduct = async () => {
    await buyProduct({
      product_id: coin.id,
      coin_id: coinPay?.coin_id,
    });
    await getWallets();
  }

  const _buy = async () => {
    const maticCoin = wallets.find(item => item.coin_id == coinPay?.coin_id);

    if (Platform?.OS == 'ios' && !isStatusFunctions) {
      getApiBuyProduct();
      return;
    }

    if (isCondition) {
      if (Number(maticCoin?.amount) < Number(coinPay?.amount)) {
        setIsBuyErrorVisible(true);
        setIsBuyProduct(false);
        setIsBugVisible(false);
        setCoin(false);
      } else {
        getApiBuyProduct()
      }
    }
  }

  const _cancel = () => {
    setIsBugVisible(false);
    setCoin(false);
  }
  const _getPriceMatic = () => (
    getCoisPriceMatic < 1
      ? formatMoneyTow(getCoisPriceMatic)
      : _abbreviateNumber(getCoisPriceMatic)
  )

  const _getPricerCTF = () => (
    getCoisPriceCTF < 1
      ? formatMoneyTow(getCoisPriceCTF)
      : _abbreviateNumber(getCoisPriceCTF)
  )
  return (
    <Dialog
      visible={isBuyVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={_cancel}
        >
          <Image
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode="cover" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.text16, localStyles.title]}>
        {isCheckIos ? i18n.t("shop.buy_item") : i18n.t("shop.order_item")}
      </Text>
      <Text style={[styles.text14]}>
        {isCheckIos ? i18n.t('shop.product') : i18n.t("shop.product_one")}
      </Text>
      <View style={[localStyles.item]}>
        <View style={[localStyles.wrapperIconBitcoin]}>
          <FastImage
            source={
              coin?.image_url ?
                {
                  uri: coin?.image_url,
                  headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal
                }
                : require('../../../assets/images/icon-bike.png')}
            style={[localStyles.iconBitcoin]}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text numberOfLines={1} style={[styles.text14SemiBold, { color: colors.black }]}>
            {coin?.name_glass}
          </Text>
          <Text style={[styles.text12Regular, localStyles.text12]}>
            {coin?.description}
          </Text>
          {isCheckIos && (
            <View style={[{ alignContent: 'center' }]}>
              {coin?.prices.map((coinPrice) => (
                <View style={[styles.row]}>
                  <View style={[localStyles.itemUnit]}>
                    <Text style={[localStyles.textUnit]}>
                      {coinPrice?.unit}
                    </Text>
                  </View>
                  <Text style={[styles.text14SemiBold, localStyles.textPrice]}>
                    {
                      coinPrice?.amount < 1
                        ? formatMoneyTow(coinPrice?.amount)
                        : _abbreviateNumber(coinPrice?.amount) + ' ' + coinPrice?.unit}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      {isCheckIos && (
        <View>
          <Text style={{ paddingVertical: 10 }} >{i18n.t('shop.method_pay')}</Text>
          <View>
            {coin?.prices?.[0] && (
              <View>
                {coin?.prices.map((coinPrice: any) => (
                  <View style={[styles.row,]}>
                    <RadioCheckboxGold
                      style={{ margin: 5 }}
                      textContent={i18n.t('shop.coin_pay_checkbox')}
                      value={coinPrice?.coin_id == coinPay?.coin_id}
                      changeValue={() => _handleChooseCoinPay(coinPrice)}
                      space={10}
                      isReverse={false}
                    />
                    <View style={[styles.row, localStyles.walletsAll]}>
                      <Text style={[localStyles.wallets]}>
                        {coinPrice.unit === 'MATIC'
                          ? _getPriceMatic()
                          : _getPricerCTF()
                        }
                      </Text>
                      <Text style={[localStyles.textUnitTow]}>
                        {coinPrice?.unit}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            <View style={[localStyles.itemTow]}></View>
            <Text style={{ paddingTop: 5 }}>
              {i18n.t('shop.terms_and_conditions')}
            </Text>
          </View>
        </View>
      )
      }
      <View style={[styles.row, { justifyContent: 'center' }]}>
        {isCheckIos && (
          <CheckBoxCustomTwo
            style={localStyles.checkBox}
            textContent={i18n.t('shop.confirm_item_order')}
            value={isCondition}
            changeValue={_handleCondition}
            space={10}
            isReverse={false}
          />
        )}
        {isCheckIos && (
          <Text style={[styles.text12Regular, { fontSize: 14, textAlign: 'center' }]}>
            {i18n.t("shop.product_one")}
          </Text>
        )}
      </View>
      <View style={[localStyles.wrapperAction]}>
        <Button
          mode="contained"
          onPress={_cancel}
          style={[styles.button, localStyles.button, { backgroundColor: colors.primary }]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}
        >
          {i18n.t("shop.cancel")}
        </Button>
        <Button
          mode="contained"
          onPress={_buy}
          style={[styles.button, localStyles.button, { backgroundColor: colors.black }]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}
        >
          {i18n.t("shop.buy_button")}
        </Button>
      </View>
    </Dialog>
  );
}

export default BuyModel;
