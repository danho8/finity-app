import { useNavigation } from "@react-navigation/native";
import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { enumSwap } from "app/service/interface/home.interface";
import { homeActionSelector, homeStateSelector } from "app/store/index";
import { _abbreviateNumber, formatMoney } from "app/utils/formatString";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, Text, TextInput, Platform, FlatList, TouchableOpacity, Image, Dimensions } from "react-native";
import { Button, Menu, useTheme } from "react-native-paper";

import styles from "../../styles";

const SwapScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [menuVisibleFrom, setMenuVisibleFrom] = useState(false);
  const [menuVisibleTo, setMenuVisibleTo] = useState(false);
  const [amountFrom, setAmountFrom] = useState('');
  const [symbolFrom, setSymbolFrom] = useState();
  const [listSymbolFrom, setListSymbolFrom] = useState([]);
  const [amountTo, setAmountTo] = useState('');
  const [symbolTo, setSymbolTo] = useState();
  const [min, setMin] = useState();
  const [balance, setBalance] = useState('');
  const [quantityHolding, setQuantityHolding] = useState('');
  const [coinSwapFee, setCoinSwapFee] = useState(0);
  const [status, setStatus] = useState(0);
  const [listSymbolTo, setListSymbolTo] = useState([]);
  const { getCoins, coinsSwap, confirmSwap, setIsConfirmSwap, coinHold } = useStoreActions(homeActionSelector);
  const { coins, isConfirmSwap } = useStoreState(homeStateSelector);
  const [isErrorMin, setIsErrorMin] = useState(false);
  const [isErrorMax, setIsErrorMax] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
        },
        imageBackground: {
          flex: 1,
          justifyContent: 'space-between',
        },
        textMatic: {
          position: 'absolute',
          right: 10,
          height: '100%',
          justifyContent: 'center'
        },
        input: {
          borderColor: colors.backgroundContent,
          borderWidth: 1,
          paddingVertical: 10.5,
          paddingHorizontal: 16,
          borderRadius: 10,
          width: (Dimensions.get('screen').width - 32) * 2 / 3 - 8,
        },
        iconDropdown: {
          width: 12,
          height: 8,
        },
        wrapperMenu: {
          justifyContent: 'space-between',
          alignItems: 'center',
          borderColor: colors.backgroundContent,
          borderWidth: 1,
          paddingHorizontal: 11,
          paddingVertical: Platform.OS == 'ios' ? 12 : 15,
          borderRadius: 10,
          width: (Dimensions.get('screen').width - 32) / 3,
        },
        wrapperItem: {
          width: (Dimensions.get('screen').width - 32) / 3,
          padding: 10,
        },
        styleFlatListFilter: {},
        flatListFilter: {},
        wrapperFee: {
          borderTopColor: colors.backgroundContent,
          borderTopWidth: 1,
        },
        button: {
          width: (Dimensions.get('screen').width - 32),
          marginTop: 38,
          alignSelf: 'center',
        },
        labelButton: {
          textTransform: 'capitalize',
        },
      }),
    []
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      })
    });
  }, [navigation]);

  useEffect(() => {
    getCoins();
  }, [])

  useEffect(() => {
    if (isConfirmSwap) {
      setIsConfirmSwap(false);
      NavigationService.navigate('CoinSituationScreen');
    }
  }, [isConfirmSwap])

  useEffect(() => {
    coins[0] && setSymbolFrom(coins[0]);
  }, [coins])

  useEffect(() => {
    _handleSymbolFrom();

    if (symbolFrom && symbolTo) {
      _getMin();
    }

    if (symbolFrom?.id == symbolTo?.id) {
      setSymbolTo(undefined);
      setAmountTo('');
    }
  }, [symbolFrom, symbolTo])

  useEffect(() => {
    if (
      amountFrom && symbolFrom && symbolTo
    ) {
      _getCoinReceive();
    } else {
      setAmountTo('');
    }

    if (amountFrom !== '' && Number(amountFrom) < Number(min)) {
      setIsErrorMin(true);
    } else {
      setIsErrorMin(false);
    }

    if (Number(amountFrom) < Number(quantityHolding)) {
      setIsErrorMax(false);
    } else {
      setIsErrorMax(true);
    }
  }, [amountFrom, symbolFrom, symbolTo, min, quantityHolding]);

  const _handleSymbolFrom = async () => {
    if (symbolFrom) {
      const resCoinHold = await coinHold({
        coin_id: symbolFrom?.id,
      });
      setQuantityHolding(`${resCoinHold?.data?.amount ? resCoinHold?.data?.amount : ''}`);
      setListSymbolFrom(coins);
      setListSymbolTo([...coins].filter((item => item.id != symbolFrom?.id)));
    }
  }

  const _getMin = async () => {
    const resCoinsSwap = await coinsSwap({
      amount: 1,
      coin_exchange: symbolFrom?.id,
      coin_receive: symbolTo?.id,
    });
    setMin(resCoinsSwap?.data?.min);
    setCoinSwapFee(resCoinsSwap?.data?.coin_swap_fee);
    setBalance(`${resCoinsSwap?.data?.balance ? resCoinsSwap?.data?.balance : ''}`);
  }

  const _getCoinReceive = async () => {
    const resCoinsSwap = await coinsSwap({
      amount: Number(amountFrom),
      coin_exchange: symbolFrom?.id,
      coin_receive: symbolTo?.id,
    });
    setStatus(resCoinsSwap?.data?.status);
    setAmountTo(`${resCoinsSwap?.data?.amount ? resCoinsSwap?.data?.amount : ''}`);
    setBalance(`${resCoinsSwap?.data?.balance ? resCoinsSwap?.data?.balance : ''}`);
  }

  const _chooseFrom = (item: any) => {
    setMenuVisibleFrom(false);
    setSymbolFrom(item);
  }

  const _chooseTo = (item: any) => {
    setMenuVisibleTo(false);
    setSymbolTo(item);
  }

  const _coinSwap = async () => {
    if (symbolFrom && symbolTo && amountFrom && amountTo && status == 1) {
      await confirmSwap({
        amount: Number(amountFrom),
        coin_exchange: symbolFrom?.id,
        coin_receive: symbolTo?.id,
        swap: enumSwap.can,
      });
    }
  }

  const _renderItemFrom = useCallback((item: any, index: number) => (
    <TouchableOpacity onPress={() => _chooseFrom(item)} style={[localStyles.wrapperItem]}>
      <Text style={[styles.text14]}>
        {item?.symbol_name}
      </Text>
    </TouchableOpacity>
  ), [i18n])

  const _renderItemTo = useCallback((item: any, index: number) => (
    <TouchableOpacity onPress={() => _chooseTo(item)} style={[localStyles.wrapperItem]}>
      <Text style={[styles.text14Regular]}>
        {item?.symbol_name}
      </Text>
    </TouchableOpacity>
  ), [i18n])

  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <View>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 13, marginTop: 13 }]}>
          <Menu
            visible={menuVisibleFrom}
            onDismiss={() => setMenuVisibleFrom(false)}
            style={[localStyles.menu]}
            contentStyle={[localStyles.contentStyleMenu]}
            anchor={
              <TouchableOpacity
                onPress={() => {
                  setMenuVisibleFrom(true);
                }}
                style={[styles.row, localStyles.wrapperMenu]}
              >
                <View>
                  <Text
                    style={[styles.text14Regular, { color: symbolFrom ? colors.black : colors.shadow }]}
                  >
                    {symbolFrom?.symbol_name}
                  </Text>
                </View>
                <Image
                  source={require('../../assets/images/icon-dropdown-color.png')}
                  style={localStyles.iconDropdown}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            }
          >
            <FlatList
              style={[localStyles.styleFlatListFilter]}
              contentContainerStyle={[localStyles.flatListFilter]}
              data={listSymbolFrom}
              numColumns={1}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => JSON.stringify(item).toString()}
              renderItem={({ item, index }: any) => _renderItemFrom(item, index)}
            />
          </Menu>
          <View >
            <TextInput
              numberOfLines={1}
              returnKeyType="next"
              placeholder={''}
              placeholderTextColor={colors.shadow}
              style={[
                styles.text14Regular,
                localStyles.input,
                { paddingRight: 60, borderColor: isErrorMax ? colors.red : colors.hint },
              ]}
              keyboardType="numeric"
              onChangeText={(text: string) => setAmountFrom(text)}
              onSubmitEditing={() => setMenuVisibleTo(true)}
              value={amountFrom}
              secureTextEntry={false}
              autoCapitalize="none"
              autoFocus={false}
            />
            <View style={localStyles.textMatic}>
              <Text style={[styles.text10ExtraBold]}>
                {symbolFrom?.symbol_name}
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.text14Regular, { marginBottom: 13}]}>
          {i18n.t('coin_situation.From')}
        </Text>
        {!!symbolFrom && (
          <Text style={[styles.text12Regular, { color: isErrorMax ? colors.red : colors.black }]}>
            {i18n.t('coin_situation.quantity_holding', { symbolName: symbolFrom?.symbol_name, quantityHolding: Number(quantityHolding < 1000) ? formatMoney(Number(quantityHolding)) : _abbreviateNumber(Number(quantityHolding)) })}
          </Text>
        )}
      </View>
      <View pointerEvents={symbolFrom ? 'auto' : 'none'}>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 13, marginTop: 35 }]}>
          <Menu
            visible={menuVisibleTo}
            onDismiss={() => setMenuVisibleTo(false)}
            style={[localStyles.menu]}
            contentStyle={[localStyles.contentStyleMenu]}
            anchor={
              <TouchableOpacity
                onPress={() => {
                  setMenuVisibleTo(true);
                }}
                style={[styles.row, localStyles.wrapperMenu, { backgroundColor: symbolFrom ? colors.white : colors.gray }]}
              >
                <View>
                  <Text
                    style={[styles.text14Regular, { color: symbolTo ? colors.black : colors.shadow }]}
                  >
                    {symbolTo?.symbol_name}
                  </Text>
                </View>
                <Image
                  source={require('../../assets/images/icon-dropdown-color.png')}
                  style={localStyles.iconDropdown}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            }
          >
            <FlatList
              style={[localStyles.styleFlatListFilter]}
              contentContainerStyle={[localStyles.flatListFilter]}
              data={listSymbolTo}
              numColumns={1}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => JSON.stringify(item).toString()}
              renderItem={({ item, index }: any) => _renderItemTo(item, index)}
            />
          </Menu>
          <View pointerEvents="none">
            <TextInput
              numberOfLines={1}
              returnKeyType="next"
              placeholder={''}
              placeholderTextColor={colors.shadow}
              style={[styles.text14Regular, localStyles.input, { paddingRight: 60, backgroundColor: colors.gray }]}
              keyboardType="numeric"
              onChangeText={(text: string) => setAmountTo(text)}
              value={amountTo}
              secureTextEntry={false}
              autoCapitalize="none"
              autoFocus={false}
            />
            <View style={localStyles.textMatic}>
              <Text style={[styles.text10ExtraBold]}>
                {symbolTo?.symbol_name}
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.text14Regular, { marginBottom: 13 }]}>
          {i18n.t('coin_situation.To')}
        </Text>
        {(!!symbolFrom && !!symbolTo) && (
          <Text style={[styles.text12Regular, { marginBottom: 13, color: isErrorMin ? colors.red : colors.black }]}>
            {i18n.t('coin_situation.Swap_Minimum_Quantity', { symbolName: symbolFrom?.symbol_name, min: Number(min < 1000) ? formatMoney(Number(min)) : _abbreviateNumber(Number(min)) })}
          </Text>
        )}
      </View>
      {(!!symbolFrom && !!symbolTo) && <View style={[localStyles.wrapperFee]}>
        <View style={[styles.row, { justifyContent: 'space-between', marginVertical: 13 }]}>
          <View>
            <Text style={[styles.text14]}>
              {i18n.t('coin_situation.swap_fee')}
            </Text>
          </View>
          <View>
            <Text style={[styles.text14, { color: colors.pink_s }]}>
              {coinSwapFee < 1000 ? formatMoney(coinSwapFee) : _abbreviateNumber(coinSwapFee)} {symbolFrom?.symbol_name}
            </Text>
          </View>
        </View>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 13 }]}>
          <View>
            <Text style={[styles.text14]}>
              {i18n.t('coin_situation.swap_balance')}
            </Text>
          </View>
          <View>
            <Text style={[styles.text14, { color: colors.pink_s }]}>
              {balance}
            </Text>
          </View>
        </View>
      </View>}
      <Button
        mode="contained"
        onPress={_coinSwap}
        style={[styles.button, localStyles.button, { backgroundColor: colors.black }]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={isLoading}
        loading={false}
      >
        {i18n.t("coin_situation.coin_swap")}
      </Button>
    </View>
  );
}

export default SwapScreen;
