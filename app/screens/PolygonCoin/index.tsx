import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Clipboard from '@react-native-community/clipboard';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { Button, Menu, useTheme } from 'react-native-paper';
import moment from 'moment-timezone';
import FastImage from 'react-native-fast-image';
import styles from '../../styles';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { _abbreviateNumber, formatMoneyTow } from 'app/utils/formatString';
import { useStoreActions, useStoreState } from 'easy-peasy';
import {
  authActionSelector,
  homeActionSelector,
  homeStateSelector,
  modalActionSelector,
  modalStateSelector,
} from 'app/store/index';
import { enumStatus } from 'app/service/interface/home.interface';

const _colorStatus = (colors: any, status: number) => {
  return colors?.black;
}

const PolygonCoinScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [amountWithdrawal, setAmountWithdrawal] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [remark, setRemark] = useState('');
  const { isWithdrawalSuccessVisible } = useStoreState(modalStateSelector);
  const [filterType, setFilterType] = useState({
    id: 1,
    name: i18n.t('polygon_coin.all'),
  });
  const [listFilter, setListFilter] = useState([
    {
      id: 1,
      name: i18n.t('polygon_coin.all'),
    },
    {
      id: 2,
      name: i18n.t('polygon_coin.deposit'),
    },
    {
      id: 3,
      name: i18n.t('polygon_coin.withdrawal'),
    },
  ]);
  const keyboardVerticalOffset = Platform.OS == 'ios' ? 85 : 0;
  const { getWallets } = useStoreActions(authActionSelector);
  const {
    historyDepositAndWithdraw,
    withdrawalRequest,
    setIsWithdrawalRequest,
  } = useStoreActions(homeActionSelector);
  const { isWithdrawalRequest } = useStoreState(homeStateSelector);
  const { setIsWithdrawalSuccessVisible } =
    useStoreActions(modalActionSelector);
  const [percentChoose, setPercentChoose] = useState(0);
  const [errorQuantity, setErrorQuantity] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [page, setPage] = useState(1);
  const [listHistoryDepositAndWithdraw, setListHistoryDepositAndWithdraw] =
    useState<any[]>([]);
  const [isCopyDone, setIsCopyDone] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          backgroundColor: colors.background,
        },
        imageBackground: {
          flex: 1,
          justifyContent: 'space-between',
        },
        button: {
          borderBottomWidth: 3,
        },
        styleFlatList: {},
        flatList: {
          paddingBottom: 220,
          width: Dimensions.get('window').width,
        },
        wrapperIconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
        },
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
        },
        item: {
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 16,
        },
        wrapperInfo: {
          marginTop: 5,
        },
        iconWallet: {
          width: 15,
          height: 15,
        },
        iconFile: {
          width: 18,
          height: 18,
          marginTop: 10,
        },
        iconFileDone: {
          width: 18,
          height: 18,
          marginTop: 10,
        },
        styleFlatListFilter: {},
        flatListFilter: {},
        tab: {
          paddingHorizontal: 10,
          paddingVertical: 7,
          textAlign: 'center',
          fontWeight: '700',
        },
        iconDropdown: {
          width: 12,
          height: 8,
        },
        menu: { marginTop: 25, marginRight: 16 },
        contentStyleMenu: {},
        wrapperMenu: {
          alignItems: 'center',
          paddingHorizontal: 16,
          borderRadius: 10,
          width: Dimensions.get('screen').width - 32,
        },
        wrapperItem: {
          width: Dimensions.get('screen').width / 3,
        },
        wrapperTitleHistory: {
          width: 45,
          height: 45,
          backgroundColor: colors.gray_900,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        },
        input: {
          paddingVertical: Platform.OS == 'ios' ? 10.5 : 5.5,
          paddingHorizontal: 16,
          borderRadius: 10,
        },
        btnUnit: {
          position: 'absolute',
          right: 10,
          height: '100%',
          justifyContent: 'center',
        },
        textMatic: {
          color: colors.blue,
          fontWeight: 'bold',
          lineHeight: 17,
          fontSize: 14
        },
        labelButton: {
          textTransform: 'capitalize',
          fontSize: 16,
        },
        buttonPercent: {
          overflow: 'hidden',
          borderRadius: 10,
          width: '22%',
        },
        itemSeparator: {
          height: 1,
          width: '100%',
          backgroundColor: colors.backgroundContent,
        },
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setListFilter([
          {
            id: 1,
            name: i18n.t('polygon_coin.all'),
          },
          {
            id: 2,
            name: i18n.t('polygon_coin.deposit'),
          },
          {
            id: 3,
            name: i18n.t('polygon_coin.withdrawal'),
          },
        ]);
        setFilterType({
          id: 1,
          name: i18n.t('polygon_coin.all'),
        });
      });
    });
  }, [navigation]);

  useEffect(() => {
    if (!isFocused) {
      setIsCopyDone(false);
    }
  }, [isFocused])

  useEffect(() => {
    if (isWithdrawalSuccessVisible) {
      setTab(1);
    }
    _handleRefresh();
  }, [filterType, isWithdrawalSuccessVisible]);

  useEffect(() => {
    if (isWithdrawalRequest) {
      _handleWithdrawalSuccess();
    }
  }, [isWithdrawalRequest]);

  const _handleWithdrawalSuccess = async () => {
    setIsWithdrawalRequest(false);
    setIsWithdrawalSuccessVisible(true);
    setAmountWithdrawal('');
    setWalletAddress('');
    setRemark('');
    setPercentChoose(0);
    setErrorQuantity(false);
    setErrorAddress(false);
    await getWallets();
  };

  const _chooseFilter = (item: any) => {
    setMenuVisible(false);
    setFilterType(item);
  };

  const defaultValue = (value: number) => {
    const amountWithdrawalTem =
      (route.params?.wallet?.amount * value) / 100
        - Number((route.params?.wallet?.amount * value) / 100) * 0.01;
    return `${Math.floor(amountWithdrawalTem * 1000) / 1000}`;
  };

  const _handleAmountWithdrawal = (percent: number) => {
    const amountWithdrawalTem =
      (route.params?.wallet?.amount * percent) / 100
        - Number((route.params?.wallet?.amount * percent) / 100) * 0.01;
    setPercentChoose(percent);
    setErrorQuantity(false);
    setAmountWithdrawal(`${Math.floor(amountWithdrawalTem * 1000) / 1000}`);
  };

  const _handleWithdrawal = async () => {
    Keyboard.dismiss();
    if (
      walletAddress &&
      amountWithdrawal &&
      Number(amountWithdrawal) > 0 &&
      Number(amountWithdrawal) <=
      Number(route.params?.wallet?.amount - Number(amountWithdrawal) * 0.01)
    ) {
      setIsLoading(true);
      await withdrawalRequest({
        address: walletAddress,
        amount: amountWithdrawal,
        coin_id: route.params?.wallet?.coin_id,
      });
      setIsLoading(false);
    } else {
      if (!amountWithdrawal) {
        setErrorQuantity(true);
      }
      if (!walletAddress) {
        setErrorAddress(true);
      }
    }
  };

  const _copyAddress = (item: any) => {
    Clipboard.setString(item?.address);
    setIsCopyDone(true);
  };

  const _redirectQRCode = (item: any) => {
    NavigationService.navigate('QRCodeScreen', { wallet: item });
  };

  const itemSeparator = () => {
    return <View style={localStyles.itemSeparator} />;
  };

  const _checkStatus = () => {
    let status;

    if (filterType?.id == 1) {
      status = enumStatus.all;
    } else if (filterType?.id == 2) {
      status = enumStatus.deposit;
    } else {
      status = enumStatus.withdrawal;
    }

    return status;
  };

  const _handleLoadMore = async () => {
    let status = _checkStatus();

    setPage(page + 1);
    const resHistoryDepositAndWithdraw = await historyDepositAndWithdraw({
      id_wallet: route.params?.wallet?.id,
      status,
      page: page,
    });
    if (resHistoryDepositAndWithdraw?.data?.data && resHistoryDepositAndWithdraw?.data?.data[0]) {
      setListHistoryDepositAndWithdraw([
        ...listHistoryDepositAndWithdraw,
        ...resHistoryDepositAndWithdraw?.data?.data,
      ]);
    }
  };

  const _handleRefresh = async () => {
    setIsLoading(true);
    let status = _checkStatus();

    setPage(2);
    const resHistoryDepositAndWithdraw = await historyDepositAndWithdraw({
      id_wallet: route.params?.wallet?.id,
      status,
      page: 1,
    });
    setListHistoryDepositAndWithdraw(resHistoryDepositAndWithdraw?.data?.data);
    setIsLoading(false);
  };

  const _renderItemFilter = useCallback(
    (item: any, index: number) => (
      <TouchableOpacity
        onPress={() => _chooseFilter(item)}
        style={[localStyles.wrapperItem]}>
        <Text style={[styles.text14Regular, { textAlign: 'center' }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [tab, i18n],
  );

  const _renderItem = useMemo(
    () => (
      <View
        style={[localStyles.item, { width: Dimensions.get('screen').width }]}>
        <View style={[localStyles.wrapperInfo]}>
          <View style={[localStyles.wrapperIconBitcoin]}>
            <FastImage
              source={
                route.params?.wallet?.image_url
                  ? {
                    uri: route.params?.wallet?.image_url,
                    headers: { Authorization: 'ImageBitcoin' },
                    priority: FastImage.priority.normal,
                  }
                  : require('../../assets/images/GL1.png')
              }
              style={[localStyles.iconBitcoin]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>
        <View
          style={{
            marginLeft: 16,
            width: Dimensions.get('screen').width - 100,
          }}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View>
              <Text style={[styles.text14SemiBold, { color: colors.gold_500 }]}>
                {route.params?.wallet?.symbol_name}
              </Text>
              <Text style={[styles.text12Regular, { marginTop: 4 }]}>
                {route.params?.wallet?.coin_name}
              </Text>
            </View>
            <View
              style={[styles.row, { alignContent: 'center', marginRight: 16 }]}>
              <Text style={[styles.text14SemiBold, { color: colors.gold_500 }]}>
                {route.params?.wallet?.amount < 1
                  ? formatMoneyTow(route.params?.wallet?.amount)
                  : _abbreviateNumber(route.params?.wallet?.amount)}{' '}
                {route.params?.wallet?.symbol_name}
              </Text>
            </View>
          </View>
          <View style={[styles.row, { flexWrap: 'nowrap' }]}>
            <TouchableOpacity
              onPress={() => _redirectQRCode(route.params?.wallet)}
              style={[styles.row, { marginTop: 10, alignItems: 'center' }]}>
              <FastImage
                source={require('../../assets/images/icon-wallet.png')}
                style={localStyles.iconWallet}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.text12Regular,
                  { fontSize: 10, marginLeft: 8, width: '80%', paddingTop: 7 },
                ]}>
                {route.params?.wallet?.address}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => _copyAddress(route.params?.wallet)}
              style={{ flex: 1, marginTop: 2 }}>
              {!isCopyDone ? (
                <FastImage
                  source={require('../../assets/images/icon-copy.png')}
                  style={[localStyles.iconFile]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : (
                <FastImage
                  source={require('../../assets/images/icon-copy-done.webp')}
                  style={[localStyles.iconFileDone]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [isCopyDone],
  );

  const _renderItemList = useCallback(
    (item: any, index: number) => (
      <View
        style={[
          localStyles.item,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 15,
          },
        ]}>
        <View style={[localStyles.wrapperInfo]}>
          {item?.status_classification_coin == 0 ? (
            <View style={[styles.button, localStyles.wrapperTitleHistory]}>
              <Text
                style={[styles.text12SemiBold, { color: colors.green_100 }]}>
                {i18n.t('polygon_coin.deposit_icon')}
              </Text>
            </View>
          ) : (
            <View style={[styles.button, localStyles.wrapperTitleHistory]}>
              <Text style={[styles.text12SemiBold, { color: colors.gold_500 }]}>
                {i18n.t('polygon_coin.withdrawal_icon')}
              </Text>
            </View>
          )}
        </View>
        <View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View>
              <Text style={[styles.text14SemiBold, { color: colors.gold_500 }]}>
                {item?.amount < 1
                  ? formatMoneyTow(item?.amount)
                  : _abbreviateNumber(item?.amount)}{' '}
                {route.params?.wallet?.symbol_name}
              </Text>
            </View>
            <View style={{ flex: 1.5 }}>
              <Text style={[styles.text14Regular, { color: _colorStatus(colors, item?.status_log_coin), textAlign: 'right' }]}>
                {item?.status_log_coin_name}
              </Text>
            </View>
          </View>
          <View style={[styles.row]}>
            <Text
              style={[
                styles.text12Regular,
                { marginRight: 5, lineHeight: 25 },
              ]}>
              {moment(item?.created_at).format('YYYY-MM-DD')}
            </Text>
            <Text style={[styles.text12Regular, { lineHeight: 25 }]}>
              {moment(item?.created_at).format('hh:mm')}
            </Text>
          </View>
          <View style={[styles.row]}>
            <Text
              style={[
                styles.text12Bold,
                { marginRight: 5, fontWeight: 'normal' },
              ]}>
              {i18n.t('polygon_coin.id_transaction')}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.text12Regular, { width: '60%', fontSize: 10 }]}>
              {route.params?.wallet?.address}
            </Text>
          </View>
        </View>
      </View>
    ),
    [tab, listHistoryDepositAndWithdraw],
  );

  const valueChoose = (value: number) => {
    return percentChoose == value && amountWithdrawal == defaultValue(value);
  };

  const _choosePersent = useMemo(
    () => (
      <View
        style={[
          styles.row,
          { justifyContent: 'space-between', marginBottom: 13 },
        ]}>
        <TouchableOpacity
          onPress={() => _handleAmountWithdrawal(100)}
          style={[
            styles.button,
            localStyles.buttonPercent,
            {
              backgroundColor: valueChoose(100) ? colors.blue : colors.gray_d9,
            },
          ]}>
          <Text
            style={[
              styles.text12SemiBold,
              localStyles.tab,
              {
                color: valueChoose(100) ? colors.white : colors.black,
              },
            ]}>
            {i18n.t('polygon_coin.maximum')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _handleAmountWithdrawal(50)}
          style={[
            styles.button,
            localStyles.buttonPercent,
            {
              backgroundColor: valueChoose(50) ? colors.blue : colors.gray_d9,
            },
          ]}>
          <Text
            style={[
              styles.text12SemiBold,
              localStyles.tab,
              {
                color: valueChoose(50) ? colors.white : colors.black,
              },
            ]}>
            50%
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _handleAmountWithdrawal(25)}
          style={[
            styles.button,
            localStyles.buttonPercent,
            {
              backgroundColor: valueChoose(25) ? colors.blue : colors.gray_d9,
            },
          ]}>
          <Text
            style={[
              styles.text12SemiBold,
              localStyles.tab,
              {
                color: valueChoose(25) ? colors.white : colors.black,
              },
            ]}>
            25%
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _handleAmountWithdrawal(10)}
          style={[
            styles.button,
            localStyles.buttonPercent,
            {
              backgroundColor: valueChoose(10) ? colors.blue : colors.gray_d9,
            },
          ]}>
          <Text
            style={[
              styles.text12SemiBold,
              localStyles.tab,
              {
                color: valueChoose(10) ? colors.white : colors.black,
              },
            ]}>
            10%
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [percentChoose, amountWithdrawal],
  );

  const _renderRequirementWithdrawal = useMemo(
    () => (
      <ScrollView>
        <View
          style={{ marginTop: 16, paddingHorizontal: 16, paddingBottom: 20 }}>
          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', marginBottom: 13 },
            ]}>
            <Text style={[styles.text14Regular, { flex: 2.5 }]}>
              {i18n.t('polygon_coin.amount_that_can_be_withdrawn')}
            </Text>
            <Text
              style={[
                styles.text14SemiBold,
                { color: colors.gold_500, flex: 5, textAlign: 'right' },
              ]}>
              {route.params?.wallet?.amount < 1
                ? formatMoneyTow(route.params?.wallet?.amount)
                : _abbreviateNumber(route.params?.wallet?.amount)}{' '}
              {route.params?.wallet?.symbol_name}
            </Text>
          </View>

          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', marginBottom: 13 },
            ]}>
            <Text style={[styles.text14Regular, { flex: 2.5 }]}>
              {i18n.t('polygon_coin.withdrawal_limit')}
            </Text>
            <Text
              style={[
                styles.text14SemiBold,
                { color: colors.gold_500, flex: 5, textAlign: 'right' },
              ]}>
              {route.params?.wallet?.amount < 1
                ? formatMoneyTow(route.params?.wallet?.amount)
                : _abbreviateNumber(route.params?.wallet?.amount)}{' '}
              {route.params?.wallet?.symbol_name}
            </Text>
          </View>
          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', marginBottom: 13 },
            ]}>
            <Text style={[styles.text14Regular, { flex: 4 }]}>
              {i18n.t('polygon_coin.withdrawal_fee', { withdrawalFee: 0.01 })}
            </Text>
            <Text
              style={[
                styles.text14SemiBold,
                { color: colors.gold_500, flex: 5, textAlign: 'right' },
              ]}>
              {_abbreviateNumber(Number(amountWithdrawal) * 0.01)}{' '}
              {route.params?.wallet?.symbol_name}
            </Text>
          </View>
          <View style={[{ marginBottom: 13 }]}>
            <View>
              <View>
                <TextInput
                  numberOfLines={1}
                  returnKeyType="next"
                  placeholder={i18n.t('polygon_coin.enter_amount_withdrawal')}
                  placeholderTextColor={colors.shadow}
                  style={[
                    styles.text14Regular,
                    localStyles.input,
                    {
                      backgroundColor:
                        (amountWithdrawal &&
                          (Number(amountWithdrawal) <= 0 ||
                            Number(amountWithdrawal) >
                            Number(
                              route.params?.wallet?.amount -
                              Number(amountWithdrawal) * 0.01,
                            ))) ||
                          errorQuantity
                          ? colors.pink_s
                          : colors.blue_300,
                    },
                  ]}
                  editable={amountWithdrawal > route.params?.wallet?.amount ? false : true}
                  keyboardType="number-pad"
                  onChangeText={(text: string) => {
                    setAmountWithdrawal(text);
                    setErrorQuantity(false);
                  }}
                  value={amountWithdrawal}
                  secureTextEntry={false}
                  autoCapitalize="none"
                  autoFocus={false}
                />
                {amountWithdrawal > route.params?.wallet?.amount
                  ? <TouchableOpacity onPress={() => setAmountWithdrawal('')} style={localStyles.btnUnit}>
                    <Image
                      source={require('../../assets/images/icon-close.png')}
                      style={{ width: 14, height: 14 }}
                      resizeMode='cover'
                    />
                  </TouchableOpacity>
                  : <View style={localStyles.btnUnit}>
                    <Text
                      style={localStyles.textMatic}>
                      {route.params?.wallet?.symbol_name}
                    </Text>
                  </View>
                }
              </View>
              {errorQuantity && (
                <Text
                  style={[
                    styles.text14Regular,
                    { color: colors.red, marginTop: 10 },
                  ]}>
                  {i18n.t('register.error_enter')}
                </Text>
              )}
            </View>
          </View>
          <>{_choosePersent}</>
          <View style={[{ marginBottom: 13 }]}>
            <Text style={[styles.text14Regular, { marginBottom: 13 }]}>
              {i18n.t('polygon_coin.wallet_address')}
            </Text>
            <View>
              <TextInput
                numberOfLines={1}
                returnKeyType="next"
                placeholder={i18n.t('polygon_coin.enter_wallet_address')}
                placeholderTextColor={colors.shadow}
                style={[
                  styles.text14Regular,
                  localStyles.input,
                  {
                    backgroundColor: errorAddress
                      ? colors.pink_s
                      : colors.accent,
                  },
                ]}
                keyboardType="default"
                onChangeText={(text: string) => {
                  setWalletAddress(text);
                  setErrorAddress(false);
                }}
                value={walletAddress}
                secureTextEntry={false}
                autoCapitalize="none"
                autoFocus={false}
              />
              {errorAddress && (
                <Text
                  style={[
                    styles.text14Regular,
                    { color: colors.red, marginTop: 10 },
                  ]}>
                  {i18n.t('polygon_coin.error_address_wallet')}
                </Text>
              )}
            </View>
          </View>
          <Button
            mode="contained"
            onPress={_handleWithdrawal}
            style={[
              styles.button,
              { backgroundColor: colors.black, borderRadius: 10 },
            ]}
            uppercase={true}
            labelStyle={[
              styles.labelButton,
              localStyles.labelButton,
              { fontSize: 16 },
            ]}
            disabled={isLoading}
            loading={isLoading}>
            {i18n.t('polygon_coin.request_withdrawal')}
          </Button>
        </View>
      </ScrollView>
    ),
    [
      amountWithdrawal,
      remark,
      i18n,
      walletAddress,
      errorQuantity,
      errorAddress,
    ],
  );
  const _renderFlatListTransaction = () => (
    <>
      {isLoading ? (
        <ActivityIndicator
          color={colors.gold_500}
          size={'small'}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          style={[localStyles.styleFlatList]}
          contentContainerStyle={[localStyles.flatList]}
          data={listHistoryDepositAndWithdraw}
          numColumns={1}
          ItemSeparatorComponent={itemSeparator}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({ item, index }: any) => _renderItemList(item, index)}
          onEndReached={_handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <View style={{ marginTop: 20 }}>
              <Text style={{ textAlign: 'center' }}>{i18n.t('polygon_coin.not_transaction')}</Text>
            </View>
          )}
        />
      )}
    </>
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={localStyles.container}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      {_renderItem}
      <View
        style={[
          styles.row,
          {
            marginTop: 16,
            justifyContent: 'space-between',
            borderBottomColor: colors.backgroundContent,
            borderBottomWidth: 1,
            position: 'relative',
            width: Dimensions.get('screen').width,
            height: 35,
          },
        ]}>
        <TouchableOpacity
          onPress={() => setTab(1)}
          style={[
            tab == 1 ? localStyles.button : styles.button,
            {
              overflow: 'hidden',
              backgroundColor: colors.transparent,
              borderBottomColor: colors.gold_500,
              borderBottomWidth: tab == 1 ? 2 : 0,
              position: 'absolute',
              marginTop: 4,
              left: '12%',
            },
          ]}>
          <Text style={[styles.text12SemiBold, localStyles.tab]}>
            {i18n.t('polygon_coin.state_deposit_withdrawal')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab(2)}
          style={[
            tab == 2 ? localStyles.button : styles.button,
            {
              backgroundColor: colors.transparent,
              borderBottomColor: colors.gold_500,
              borderBottomWidth: tab == 2 ? 2 : 0,
              position: 'absolute',
              marginTop: 4,
              marginLeft: 25,
              right: '12%',
            },
          ]}>
          <Text style={[styles.text12SemiBold, localStyles.tab]}>
            {i18n.t('polygon_coin.requirement_withdrawal')}
          </Text>
        </TouchableOpacity>
      </View>

      {tab == 1 ? (
        <>
          <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                paddingTop: 18,
                paddingBottom: 5,
              },
            ]}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              style={[localStyles.menu]}
              contentStyle={[localStyles.contentStyleMenu]}
              anchor={
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(true);
                  }}
                  style={[styles.row, localStyles.wrapperMenu]}>
                  <View>
                    <Text
                      style={[
                        styles.text14Regular,
                        {
                          color: filterType?.name
                            ? colors.black
                            : colors.shadow,
                          marginRight: 10,
                        },
                      ]}>
                      {filterType?.name}
                    </Text>
                  </View>
                  <FastImage
                    source={require('../../assets/images/icon-dropdown.png')}
                    style={localStyles.iconDropdown}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              }>
              <FlatList
                style={[localStyles.styleFlatListFilter]}
                contentContainerStyle={[localStyles.flatListFilter]}
                data={listFilter}
                numColumns={1}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => JSON.stringify(item).toString() + index}
                renderItem={({ item, index }: any) =>
                  _renderItemFilter(item, index)
                }
                ItemSeparatorComponent={itemSeparator}
              />
            </Menu>
          </View>
          {_renderFlatListTransaction()}
        </>
      ) : (
        <>{_renderRequirementWithdrawal}</>
      )}
    </KeyboardAvoidingView>
  );
};

export default PolygonCoinScreen;
