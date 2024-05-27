import { useNavigation } from '@react-navigation/native';
import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import styles from 'app/styles';
import React, { useEffect, useMemo, useState } from 'react';
import momentTz from 'moment-timezone';
import {
  StyleSheet,
  View,
  StatusBar,
  Keyboard,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, useTheme } from 'react-native-paper';
import {
  homeActionSelector,
  homeStateSelector,
  modalActionSelector,
} from 'app/store/index';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Geolocation from 'react-native-geolocation-service';
import RNLocalize from 'react-native-localize';
import { cycleHistory } from 'app/service/firestore';

const currentTime = momentTz
  .tz(new Date(), RNLocalize.getTimeZone())
  .clone()
  .tz('Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const MapScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const {
    goRiceEndRoad,
    setRegion,
    setIsGoRiceEndRoad,
    setIsCheckReachedLocationTarget,
    setTimeEnd,
  } = useStoreActions(homeActionSelector);
  const { dataGoRiceStart, isGoRiceEndRoad, riceHistory, time, heading, riceStart } =
    useStoreState(homeStateSelector);
  const { setIsEndOfRideVisible } = useStoreActions(modalActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
        },
        map: {
          position: 'absolute',
          height: '100%',
          width: '100%',
        },
        button: {
          marginBottom: 25,
          marginHorizontal: 16,
        },
        iconCloseMap: {
          width: 36,
          height: 36,
        },
        wrapperDetail: {
          paddingTop: 8,
          paddingBottom: 2,
          paddingHorizontal: 12,
          backgroundColor: colors.accent,
          borderRadius: 5,
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
      try {
        Keyboard.dismiss();
        setIsLoading(true);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        });
      }
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      if (isGoRiceEndRoad) {
        setIsGoRiceEndRoad(false);
        setIsEndOfRideVisible(true);
        _goBack();
      }
    })();
  }, [isGoRiceEndRoad]);

  const _handleCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      pos => {
        console.log('_handleCurrentLocation', pos);

        setRegion({
          latitude: pos?.coords?.latitude,
          longitude: pos?.coords?.longitude,
        });
      },
      error => {
        console.warn('GetCurrentPosition Error', error);
      },
      { enableHighAccuracy: true, forceRequestLocation: true },
    );
  };

  const _goBack = () => NavigationService.goBack();

  const _handleEndOfRide = async () => {
    let goal = 0;
    if (riceHistory?.content_json?.goal) {
      setIsCheckReachedLocationTarget(true);
      goal = 1;
    }
    setIsLoading(true);

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

    goRiceEndRoad({
      goal,
    }).finally(() => setIsLoading(false));
  };

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

  const _renderDetail = useMemo(
    () => (
      <View
        style={[
          localStyles.wrapperDetail,
          { backgroundColor: colors.backgroundtabar },
        ]}>
        <Text
          style={[
            styles.text18Regular,
            { color: colors.text_content, marginBottom: 5 },
          ]}>
          {i18n.t('go_rice.travel_distance')}:{' '}
          <Text style={[styles.text20Regular, { color: colors.primary }]}>
            {Number(riceHistory?.distance || 0).toFixed(2)}
          </Text>
          {i18n.t('km')}
        </Text>
        <Text
          style={[
            styles.text18Regular,
            { color: colors.text_content, marginBottom: 5 },
          ]}>
          {i18n.t('go_rice.time')}:{' '}
          <Text style={[styles.text18Regular, { color: colors.primary }]}>
            {timeCycle}
          </Text>
        </Text>
      </View>
    ),
    [isLoading, timeCycle, riceHistory],
  );

  return (
    <View style={[localStyles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <MapView
        provider={__DEV__ ? undefined : PROVIDER_GOOGLE}
        style={[localStyles.map]}
        region={{
          latitude: riceHistory?.address_current_json?.latitude,
          longitude: riceHistory?.address_current_json?.longitude,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}>
        <Marker.Animated
          coordinate={{
            latitude: riceHistory?.address_current_json?.latitude,
            longitude: riceHistory?.address_current_json?.longitude,
          }}>
          <Image
            source={
              dataGoRiceStart?.product_image
                ? { uri: dataGoRiceStart?.product_image }
                : require('../../assets/images/image-bike.png')
            }
            style={{
              width: 55,
              height: 55,
              transform: [
                {rotate: `${Number(heading) > 0 ? (Number(heading) - 90 ) : 0}deg`},
                {scaleY: (Number(heading) >= 180 && Number(heading) < 360) ? -1 : 1},
              ],
            }}
            resizeMode="contain"
          />
        </Marker.Animated>
        {(riceHistory?.content_json?.goal && riceHistory.goal_setting == 1) && (
          <Marker
            coordinate={{
              latitude: riceHistory?.content_json?.goal?.latitude,
              longitude: riceHistory?.content_json?.goal?.longitude,
            }}>
            <Image
              source={require('../../assets/images/icon-place.png')}
              style={{ width: 20, height: 25, alignSelf: 'center' }}
            />
          </Marker>
        )}
      </MapView>
      <View style={[{ position: 'absolute', top: 12, left: 16 }]}>
        {_renderDetail}
      </View>
      <View style={[{ position: 'absolute', top: 12, right: 16 }]}>
        <TouchableOpacity onPress={_goBack}>
          <Image
            source={require('../../assets/images/icon-close-map.png')}
            style={localStyles.iconCloseMap}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <View style={[{ position: 'absolute', bottom: 90, right: 16 }]}>
        <TouchableOpacity onPress={_handleCurrentLocation}>
          <Image
            source={require('../../assets/images/icon-current-place.png')}
            style={localStyles.iconCloseMap}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <View style={[{ position: 'absolute', bottom: 0, width: '100%' }]}>
        <Button
          mode="contained"
          onPress={_handleEndOfRide}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.btn_black },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, { textTransform: 'none' }]}
          disabled={isLoading}
          loading={isLoading}>
          {i18n.t('go_rice.end_of_ride')}
        </Button>
      </View>
    </View>
  );
};

export default MapScreen;
