import i18n from 'app/i18n';
import {
  authActionSelector,
  homeActionSelector,
  homeStateSelector,
  modalActionSelector,
  modalStateSelector,
} from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';
import momentTz from 'moment-timezone';
import RNLocalize from 'react-native-localize';
import { initRicehistory } from 'app/store/model/home';
import { _abbreviateNumber } from 'app/utils/formatString';

const currentTime = momentTz
  .tz(new Date(), RNLocalize.getTimeZone())
  .clone()
  .tz('Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const EndOfRideModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsEndOfRideVisible } = useStoreActions(modalActionSelector);
  const { isEndOfRideVisible } = useStoreState(modalStateSelector);
  const { dataGoRiceCycling, isCheckReachedLocationTarget, timeEnd, riceHistoryEnd } =
    useStoreState(homeStateSelector);
  const { confirmReward, setIsCheckReachedLocationTarget, setTimeEnd, setRiceHistoryEnd } =
    useStoreActions(homeActionSelector);
  const { getWallets } = useStoreActions(authActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 32.5,
          backgroundColor: colors.background,
        },
        title: {
          fontWeight: '400',
          marginTop: 5,
          lineHeight: 19,
          marginBottom: 23,
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
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 5,
          paddingVertical: 8,
          width: '100%',
        },
        wrapperAction: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 42,
        },
        textCompositeInformation: {
          marginBottom: 33,
          color: colors.gold_500,
          lineHeight: 19,
          textAlign: 'center',
        },
        textValueContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        textContent: {
          color: colors.btn_black,
          lineHeight: 30,
        },
        textValue: {
          color: colors.gold_500,
          fontWeight: 'bold',
          marginLeft: 5,
          lineHeight: 30,
        },
      }),
    [],
  );

  useEffect(() => {
    setIsCheckReachedLocationTarget(false);
  }, []);

  const _submit = async () => {
    await confirmReward({
      receive: 1,
    });
    await getWallets();
    _cancel();
  };

  const _cancel = () => {
    setIsEndOfRideVisible(false);
    setTimeEnd(0);
    setRiceHistoryEnd(initRicehistory);
  };

  const _checkTime = (data: string) => {
    if (!data) {
      return '00:00:00';
    }
    let time = data.split(':');
    if (
      time.length >= 3 &&
      time[0] === '00' &&
      time[1] === '00' &&
      time[2] <= '60'
    ) {
      time[2] = '00';
      return time.join(':');
    } else {
      return data;
    }
  };

  const timeCycle = useMemo(() => {
    let startTime = '';
    if (riceHistoryEnd?.created_at) {
      startTime = riceHistoryEnd?.created_at;
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
      .add((diffSecond < 0 ? 0 : diffSecond) + timeEnd, 'seconds')
      .format('HH:mm:ss');
  }, [timeEnd, riceHistoryEnd]);

  return (
    <Dialog
      visible={isEndOfRideVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={localStyles.container}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_cancel}>
          <Image
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t('map.end_of_ride')}
      </Text>
      <Text style={[styles.text16Medium, localStyles.textCompositeInformation]}>
        {i18n.t('map.thank_you_effot')}
      </Text>
      <View>
        <View style={localStyles.textValueContainer}>
          <Text style={[styles.text14Regular, localStyles.textContent]}>
            {i18n.t('map.distance_traveled')} :
          </Text>
          <Text style={[styles.text14Regular, localStyles.textValue]}>
            {Number(dataGoRiceCycling?.distance || 0).toFixed(3)}
          </Text>
          <Text style={[styles.text14Regular, localStyles.textContent]}>
            km
          </Text>
        </View>
        <View style={localStyles.textValueContainer}>
          <Text style={[styles.text14Regular, localStyles.textContent]}>
            {i18n.t('map.travel_time')} :
          </Text>
          <Text style={[styles.text14Regular, localStyles.textValue]}>
            {timeCycle}
          </Text>
        </View>
        <View style={localStyles.textValueContainer}>
          <Text style={[styles.text14Regular, localStyles.textContent]}>
            {i18n.t('map.calories_consumed')} :
          </Text>
          <Text style={[styles.text14Regular, localStyles.textValue]}>
            {Number(dataGoRiceCycling?.calories || 0).toFixed(2)}
          </Text>
          <Text style={[styles.text14Regular, localStyles.textContent]}>
            kcal
          </Text>
        </View>
        {!!dataGoRiceCycling?.goal_setting && isCheckReachedLocationTarget && (
          <View style={localStyles.textValueContainer}>
            <Text style={[styles.text14Regular, localStyles.textContent]}>
              {i18n.t('map.reach_the_target_point')} :
            </Text>
            <Text style={[styles.text14Regular, localStyles.textValue]}>
              {i18n.t('map.completion')}
            </Text>
          </View>
        )}
      </View>
      {Platform.OS === 'android' && (
        <View style={{ marginTop: 23 }}>
          <View style={localStyles.textValueContainer}>
            <Text style={[styles.text14Regular, localStyles.textContent]}>
              {i18n.t('map.total')}
            </Text>
            <Text style={[styles.text14Regular, localStyles.textValue]}>
              {_abbreviateNumber(Number(riceHistoryEnd?.mining || 0))} {i18n.t('CFT')}
            </Text>
            <Text style={[styles.text14Regular, localStyles.textContent]}>
              {i18n.t('map.total_amount_received')}
            </Text>
          </View>
          <Text style={[styles.text14Regular, localStyles.textContent]}>
            {i18n.t('map.receive_your_mined_coins')}
          </Text>
        </View>
      )}
      {Platform.OS === 'android' && (
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
            {i18n.t('map.later')}
          </Button>
          <Button
            mode="contained"
            onPress={_submit}
            style={[
              styles.button,
              localStyles.button,
              { backgroundColor: colors.btn_black },
            ]}
            uppercase={true}
            labelStyle={[styles.labelButton, localStyles.labelButton]}
            disabled={false}
            loading={false}>
            {i18n.t('map.coin_payment')}
          </Button>
        </View>
      )}
    </Dialog>
  );
};

export default EndOfRideModel;
