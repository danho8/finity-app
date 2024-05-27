import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { Button, useTheme } from 'react-native-paper';
import Orientation from 'react-native-orientation';
import { useStoreActions, useStoreState } from 'easy-peasy';
import {
  authActionSelector,
  authStateSelector,
  homeActionSelector,
  homeStateSelector,
  modalActionSelector,
  modalStateSelector,
  shopStateSelector,
} from 'app/store';
import { useNavigation } from '@react-navigation/native';
import i18n from 'app/i18n';
import styles from 'app/styles';
import NavigationService from 'app/navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import { _getRoute } from 'app/utils/mapApi';

import FastImage from 'react-native-fast-image';
import momentTz from 'moment-timezone';

import RNLocalize from 'react-native-localize';
import { _abbreviateNumber, formatMoney } from 'app/utils/formatString';
import { cycleHistory } from 'app/service/firestore';

const currentTime = momentTz
  .tz(new Date(), RNLocalize.getTimeZone())
  .clone()
  .tz('Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const _showTotalDistance = (historyToday: any) => {
  return {
    totalDistance: historyToday?.total_distance ? Number(historyToday?.total_distance).toFixed(2) : '0',
    totalCalories: historyToday?.total_calories ? Number(historyToday?.total_calories).toFixed(2) : '0',
  }
}

const GoRiceScreen = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckBikeDefaultEmpty, setIsCheckBikeDefaultEmpty] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { getWallets } = useStoreActions(authActionSelector);
  const { wallets } = useStoreState(authStateSelector);
  const {
    setIsPaymentVisible,
    setIsChooseLocationVisible,
    setIsChangeItemVisible,
    setIsEndOfRideVisible,
  } = useStoreActions(modalActionSelector);
  const {
    getBikeInformationDefault,
    getHistoryToday,
    setDataGoRiceStart,
    updateWallet,
    goRiceEndRoad,
    setIsGoRiceEndRoad,
    setIsCheckReachedLocationTarget,
    getCollectionId,
    setTimeEnd,
  } = useStoreActions(homeActionSelector);
  const {
    dataGoRiceStart,
    dataGoRiceCycling,
    region,
    isGoRiceEndRoad,
    riceHistory,
    time,
    riceStart,
  } = useStoreState(homeStateSelector);
  const { isSettingBike, isStatusFunctions } = useStoreState(shopStateSelector);
  const [historyToday, setHistoryToday] = useState<any>();
  const [remainDistance, setRemainDistance] = useState<number>(0);
  const { isChooseLocationVisible } = useStoreState(modalStateSelector);
  const coinMatic = historyToday?.coin_matic_swap;
  const coinCFT = historyToday?.total_mining;

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        contained: {
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        wrapperDetail: {
          marginTop: 34,
          paddingVertical: 15,
          paddingHorizontal: 9,
          backgroundColor: colors.accent,
          borderRadius: 5,
          marginBottom: 34,
        },
        imageBike: {
          marginBottom: 17,
          width: '100%',
          height: 250,
        },
        button: {
          width: (Dimensions.get('window').width - 43) / 2,
        },
        labelButton: {
          textTransform: 'none'
        },
        iconCilMap: {
          width: 50,
          height: 30,
        },
        countMap: {
          color: colors.btn_black,
          backgroundColor: colors.green_100,
        },
      }),
    [],
  );

  const collectionId: null | string = useMemo(() => {
    if (!riceStart?.firestore_collection?.document_id) {
      return null;
    }

    return riceStart?.firestore_collection?.document_id;
  }, [riceStart]);

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      Orientation.lockToPortrait();
      await _getData();
      _getRemainDistance();
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1);
    });
  }, [navigation, isLoading, dataGoRiceStart]);

  useEffect(() => {
    let intervalNumber: NodeJS.Timeout;

    if (wallets[0]) {
      (async () => {
        intervalNumber = setTimeout(_handleCronjobWallets, 10000);
      })();
    } else {
      setTimeout(() => {
        setRefresh(refresh + 1);
      }, 3000);
    }

    return () => {
      clearTimeout(intervalNumber);
    };
  }, [refresh]);

  useEffect(() => {
    _getData();
  }, []);

  useEffect(() => {
    _getData();
  }, [isChooseLocationVisible, isSettingBike]);

  useEffect(() => {
    _getRemainDistance();
  }, [dataGoRiceCycling, region]);

  useEffect(() => {
    if (isGoRiceEndRoad) {
      _getData().then(() => {
        setIsGoRiceEndRoad(false);
        setIsEndOfRideVisible(true);
        NavigationService.navigate(i18n.t('tab_navigator.go-rice'));
      });
    }
  }, [isGoRiceEndRoad]);

  const _getRemainDistance = async () => {
    if (
      dataGoRiceCycling &&
      dataGoRiceCycling?.goal_setting == 1 &&
      region?.latitude &&
      region?.longitude
    ) {
      const resRoute = await _getRoute(
        { latitude: region?.latitude, longitude: region?.longitude },
        {
          latitude: dataGoRiceCycling?.content_json?.goal?.latitude,
          longitude: dataGoRiceCycling?.content_json?.goal.longitude,
        },
      );
      setRemainDistance(resRoute?.distance || 0);
    }
  };

  const _handleCronjobWallets = async () => {
    for (let wallet of wallets) {
      await updateWallet({
        coin_id: wallet?.id,
      });
    }
    await getWallets();
    setRefresh(refresh + 1);
  };

  const _getData = async () => {
    try {
      const resBikeInformationDefault = await getBikeInformationDefault();

      if (resBikeInformationDefault?.data) {
        setIsCheckBikeDefaultEmpty(true);
        const resHistoryToday = await getHistoryToday();

        setHistoryToday(resHistoryToday?.data);
        setDataGoRiceStart(resBikeInformationDefault?.data);
      }
    } catch (error) {
      console.log('_getDataError', error);
    }
  };

  const _goRiding = () => {
    setIsChooseLocationVisible(true);
  };

  const _showCoinPayment = () => setIsPaymentVisible(true);

  const _goShop = () => {
    NavigationService.navigate(i18n.t('tab_navigator.shop'));
  };

  const _changeItem = () => {
    setIsChangeItemVisible(true);
  };

  const _endOfRide = async () => {
    try {
      setIsLoading(true);
      let goal = 0;
      if (riceHistory?.content_json?.goal) {
        setIsCheckReachedLocationTarget(true);
        goal = 1;
      }

      if (collectionId) {
        setTimeEnd(time);
        cycleHistory
          .doc(collectionId)
          .update({
            ...riceHistory,
            time: timeCycle,
          })
          .then(() => {
            console.log('User updated!');
          })
          .catch(error => console.log('update firestore error:', error));
      }

      await goRiceEndRoad({
        goal,
      });
      await getCollectionId();
    } catch (error) {
      console.log('_endOfRideError', error);
    } finally {
      setIsLoading(false);
    }
  };

  const _redirectMap = () => {
    NavigationService.navigate('MapScreen');
  };

  const _renderDetail = useMemo(
    () => (
      <View style={[localStyles.wrapperDetail]}>
        <Text
          style={[
            styles.text14Regular,
            { color: colors.text_content, lineHeight: 30 },
          ]}>
          {i18n.t('go_rice.distance_traveled_today')}:{' '}
          <Text style={[styles.text20Regular, { color: colors.gold_500 }]}>
            {_showTotalDistance(historyToday)?.totalDistance}
          </Text>
          {i18n.t('km')}
        </Text>
        <Text
          style={[
            styles.text14Regular,
            { color: colors.text_content, lineHeight: 30 },
          ]}>
          <Text style={{ lineHeight: 30 }}>
            {i18n.t('go_rice.today_travel_time')}: {historyToday?.total_time}{' '}
          </Text>
          <Text
            style={[
              styles.text14Regular,
              { color: colors.text_content, lineHeight: 30 },
            ]}>
            {i18n.t('go_rice.cumulative_calories_consumed')}:{' '}
            <Text style={[styles.text20Regular, { color: colors.gold_500 }]}>
              {_showTotalDistance(historyToday)?.totalCalories}
            </Text>
            {historyToday?.unit_calories}
          </Text>
        </Text>
        <Text
          style={[
            styles.text14Regular,
            { color: colors.text_content, lineHeight: 30, display: (Platform?.OS != 'ios' || isStatusFunctions) ? 'flex' : 'none' },
          ]}>
          {i18n.t('go_rice.coins_mined_today')}: {i18n.t('MATIC')}{' '}
          {Number(coinMatic < 1000)
            ? formatMoney(coinMatic)
            : _abbreviateNumber(Number(coinMatic))
          } /{' '}
          {historyToday?.unit_mining} {Number(coinCFT < 1000)
            ? formatMoney(coinCFT)
            : _abbreviateNumber(Number(coinCFT))
          }
        </Text>
        <Text
          style={[
            styles.text14Regular,
            { color: colors.text_content, lineHeight: 30 },
          ]}>
          {i18n.t('go_rice.bike_durability')}: {dataGoRiceStart?.durability}/100
        </Text>
      </View>
    ),
    [isLoading, dataGoRiceStart, dataGoRiceCycling, historyToday, isStatusFunctions],
  );

  const _renderNoRidingMode = useMemo(
    () => (
      <View>
        <Text style={[styles.text14Medium]}>
          {dataGoRiceStart?.product} LV.{dataGoRiceStart?.level}
        </Text>
        <FastImage
          source={{ uri: dataGoRiceStart?.product_image }}
          style={localStyles.imageBike}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View
          style={[styles.row, { justifyContent: 'center', marginBottom: 24 }]}>
          <Button
            mode="contained"
            onPress={_goRiding}
            style={[
              styles.button,
              { backgroundColor: colors.blue, borderRadius: 100 },
            ]}
            uppercase={true}
            labelStyle={[styles.labelButton]}
            disabled={false}
            loading={false}>
            {i18n.t('go_rice.go_riding')}
          </Button>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent:
                Platform.OS == 'android' ? 'space-between' : 'center',
              marginBottom: 20,
            },
          ]}>
          {Platform.OS == 'android' && (
            <Button
              mode="contained"
              onPress={_showCoinPayment}
              style={[
                styles.button,
                localStyles.button,
                { backgroundColor: colors.primary },
              ]}
              uppercase={true}
              labelStyle={[styles.labelButton, localStyles.labelButton]}
              disabled={false}
              loading={false}>
              {i18n.t('go_rice.coin_payment')}
            </Button>
          )}
          <Button
            mode="contained"
            onPress={_changeItem}
            style={[
              styles.button,
              localStyles.button,
              { backgroundColor: colors.btn_black },
            ]}
            uppercase={true}
            labelStyle={[styles.labelButton, localStyles.labelButton]}
            disabled={false}
            loading={false}>
            {i18n.t('go_rice.item_replacement')}
          </Button>
        </View>
      </View>
    ),
    [isLoading, dataGoRiceStart, dataGoRiceCycling],
  );

  const timeCycle = useMemo(() => {
    let startTime = '';
    if (riceHistory?.created_at) {
      startTime = riceHistory?.created_at;
    }

    if (startTime === '') {
      return '00:00:00';
    }

    const diffSecond = momentTz(currentTime, 'YYYY-MM-DD HH:mm:ss').diff(
      momentTz(startTime, 'YYYY-MM-DD HH:mm:ss'),
      'seconds',
    );

    return momentTz
      .tz(new Date(), RNLocalize.getTimeZone())
      .clone()
      .tz('Asia/Seoul')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .add((diffSecond < 0 ? 0 : diffSecond) + time, 'seconds')
      .format('HH:mm:ss');
  }, [riceHistory, time]);

  const _renderRidingMode = useMemo(
    () => (
      <View>
        {dataGoRiceCycling?.goal_setting == 1 && (
          <Text
            style={[
              styles.text14Regular,
              {
                color: colors.text_content,
                marginBottom: 10,
                textAlign: 'center',
              },
            ]}>
            {i18n.t('go_rice.space_total_target_one')}
            <Text style={[styles.text20Regular, { color: colors.primary }]}>
              {remainDistance}
            </Text>
            {i18n.t('go_rice.space_total_target_two')}
          </Text>
        )}
        <Text style={[styles.text14Medium]}>
          {dataGoRiceStart?.product} LV.{dataGoRiceStart?.level}
        </Text>
        <FastImage
          source={{ uri: dataGoRiceStart?.product_image }}
          style={localStyles.imageBike}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text
          style={[
            styles.text14Regular,
            {
              color: colors.text_content,
              marginBottom: 10,
              textAlign: 'center',
            },
          ]}>
          <Text style={[styles.text20Regular, { color: colors.primary }]}>
            {Number(riceHistory?.average_speed || 0).toFixed(2)}
          </Text>
          {i18n.t('km/h')}
        </Text>
        <View
          style={[
            localStyles.wrapperDetail,
            { marginBottom: 13, backgroundColor: colors.backgroundtabar },
          ]}>
          <Text
            style={[
              styles.text16Regular,
              { color: colors.text_content, marginBottom: 5 },
            ]}>
            {i18n.t('go_rice.time')}:{' '}
            <Text style={[styles.text16Regular, { color: colors.primary }]}>
              {timeCycle}
            </Text>
          </Text>
          <Text
            style={[
              styles.text16Regular,
              { color: colors.text_content, marginBottom: 5 },
            ]}>
            {i18n.t('go_rice.travel_distance')}:{' '}
            <Text style={[styles.text16Regular, { color: colors.text_content }]}>
              <Text style={[styles.text16Regular, { color: colors.primary }]}>
                {Number(riceHistory?.distance || 0).toFixed(2)}
              </Text>
              {i18n.t('km')}
            </Text>
          </Text>
          <Text
            style={[
              styles.text16Regular,
              { color: colors.text_content, marginBottom: 5, display: (Platform?.OS != 'ios' || isStatusFunctions) ? 'flex' : 'none' },
            ]}>
            {i18n.t('go_rice.mining')}:{' '}
            <Text style={[styles.text16Regular, { color: colors.text_content }]}>
              <Text style={[styles.text16Regular, { color: colors.primary }]}>
                {Number(riceHistory?.mining || 0).toFixed(2)}{' '}
              </Text>
              {i18n.t('CFT')}
            </Text>
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={_endOfRide}
          style={[
            styles.button,
            { backgroundColor: colors.btn_black, marginBottom: 24 },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={isLoading}>
          {i18n.t('go_rice.end_of_ride')}
        </Button>
      </View>
    ),
    [
      isLoading,
      dataGoRiceStart,
      dataGoRiceCycling,
      remainDistance,
      timeCycle,
      riceHistory,
    ],
  );

  const _renderNoBike = useMemo(
    () => (
      <View>
        <Text
          style={[
            styles.text14Regular,
            { textAlign: 'center', marginTop: 100, marginBottom: 50 },
          ]}>
          {i18n.t('go_rice.not_bike')}
        </Text>
        <FastImage
          source={require('../../assets/images/image-bike.png')}
          style={localStyles.imageBike}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View
          style={[styles.row, { justifyContent: 'center', marginBottom: 24 }]}>
          <Button
            mode="contained"
            onPress={_goShop}
            style={[
              styles.button,
              { backgroundColor: colors.blue, borderRadius: 100 },
            ]}
            uppercase={true}
            labelStyle={[styles.labelButton]}
            disabled={false}
            loading={false}>
            {i18n.t('go_rice.shop')}
          </Button>
        </View>
      </View>
    ),
    [isLoading, dataGoRiceStart, dataGoRiceCycling],
  );

  const _renderIconCilMap = useMemo(
    () => (
      <View style={{ alignItems: 'flex-end', height: 42, marginTop: 8 }}>
        <TouchableOpacity onPress={_redirectMap}>
          <Image
            source={require('../../assets/images/icon-cil-map.png')}
            style={localStyles.iconCilMap}
            resizeMode="cover"
          />
          <Text style={[styles.text12Regular, { textAlign: 'center' }]}>
            MAP
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [isLoading, dataGoRiceStart, dataGoRiceCycling],
  );

  const _checkDefaultEmptyStart = () => (
    <View>
      {isCheckBikeDefaultEmpty && !!dataGoRiceStart?.is_cycling && (
        <>
          {_renderIconCilMap}
          {_renderDetail}
          {_renderRidingMode}
        </>
      )}
      {isCheckBikeDefaultEmpty && !dataGoRiceStart?.is_cycling && (
        <>
          {_renderDetail}
          {_renderNoRidingMode}
        </>
      )}
    </View>
  );

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={localStyles.contained}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      {!isCheckBikeDefaultEmpty ? (
        <>{_renderNoBike}</>
      ) : (
        _checkDefaultEmptyStart()
      )}
    </ScrollView>
  );
};

export default GoRiceScreen;
