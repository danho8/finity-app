import {useEffect, useCallback, useMemo, useState} from 'react';
import {useStoreState, useStoreActions} from 'easy-peasy';
import Geolocation from 'react-native-geolocation-service';
import RNLocalize from 'react-native-localize';
import momentTz from 'moment-timezone';

import {
  homeStateSelector,
  modalActionSelector,
  homeActionSelector,
} from 'app/store';
import {
  getCaloriesBySpeed,
  getMiningByCalories,
  hhmmss,
} from 'app/utils/generator';
import log from 'app/utils/sentry';
import {cycleHistory} from 'app/service/firestore';
import {DEFAULT_POSITION} from 'app/config/constant-config';
import {_getRoute, _getCurrentLocation, _locationPermission} from 'app/utils/mapApi';

export const useGeolocation = () => {
  const {riceStart, formulas, riceHistory, time, dataGoRiceStart, isFreeBike} =
    useStoreState(homeStateSelector);
  const {setIsStopMiningVisible, setIsNearDestination} =
    useStoreActions(modalActionSelector);
  const {setRegion, getCollectionId, setRiceHistory, setTime, clearTime, setHeading} =
    useStoreActions(homeActionSelector);
  const [position, setPosition] = useState();

  // get collection id
  const collectionId: null | string = useMemo(() => {
    if (!riceStart?.firestore_collection?.document_id) {
      return null;
    }

    return riceStart?.firestore_collection?.document_id;
  }, [riceStart]);

  // calculate calories (Kcal)
  const getCalories = useCallback(
    (averageSpeed: number, timeRun: number) => {
      if (!formulas.calories) {
        return 0;
      }

      return (
        (formulas.calories.data.weight + formulas.calories.data.bike_weight) *
        getCaloriesBySpeed(averageSpeed) *
        Number((timeRun / 60).toFixed(2))
      );
    },
    [formulas],
  );

  // calculate mining
  const getMining = useCallback(
    (calories: number) => {
      if (!formulas.mining) {
        return 0;
      }

      const calMining =
        (formulas.mining.data.highest_durability -
          (100 - formulas.mining.data.product_inventory_durability) *
            formulas.mining.data.ratio_of_durability) *
        (formulas.mining.data.value_category + formulas.mining.data.level) *
        getMiningByCalories(calories);

      return calMining < 0 ? 0 : calMining;
    },
    [formulas],
  );

  useEffect(() => {
    _getLiveLocation()
  }, [])

  const _getLiveLocation = async () => {
    const locPermissionDenied = await _locationPermission();
    if (locPermissionDenied) {
        const { heading } = await _getCurrentLocation();
        log.debug('get live location after 4 second', JSON.stringify(heading));
        setHeading(heading);
    }
  }

  useEffect(() => {
    // check if collection id exists, sync with firestore
    log.debug('collectionId', collectionId);
    let watchid: number = -1;

    if (collectionId) {
      log.debug('startSubcribe');
      watchid = Geolocation.watchPosition(
        pos => {
          log.debug('pos', JSON.stringify(pos));
          if (
            pos.coords.speed &&
            pos.coords.speed > 0 &&
            pos.coords.speed * 3.6 <= 40
          ) {
            // Update current lat-lng
            setPosition(pos);
            setHeading(pos?.coords?.heading);
            setIsStopMiningVisible(false);
          } else if (pos.coords.speed && pos.coords.speed * 3.6 > 40) {
            setIsStopMiningVisible(true);
          }
        },
        error => log.debug('WatchPosition Error', JSON.stringify(error)),
        {
          distanceFilter: 20,
          enableHighAccuracy: true,
        },
      );

      const subscriber = cycleHistory
        .doc(collectionId)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot) {
            const data = documentSnapshot.data();
            if (data) {
              setRiceHistory(data);
            }
          }
        });

      return () => {
        log.debug('unsubribe');
        subscriber();
        Geolocation.clearWatch(watchid);
      };
    } else {
      log.debug('unsubribe');
      Geolocation.clearWatch(watchid);
    }
  }, [collectionId]);

  useEffect(() => {
    if (collectionId && !!dataGoRiceStart?.is_cycling) {
      const intervalId = setInterval(() => {
        setTime(1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      clearTime();
    }
  }, [collectionId, dataGoRiceStart]);

  useEffect(() => {
    log.debug('start use Geolocation');
    getCollectionId()
      .then(res => log.debug('getCollectionId', JSON.stringify(res)))
      .catch(error => {
        log.debug('getCollectionId error:', error);
        Geolocation.getCurrentPosition(
          pos => {
            log.debug('getCurrentPosition', JSON.stringify(pos));
            setRegion({
              latitude: pos?.coords?.latitude,
              longitude: pos?.coords?.longitude,
            });
          },
          errorGeo => {
            log.debug('GetCurrentPosition Error', errorGeo);
            setRegion(DEFAULT_POSITION);
          },
          {
            enableHighAccuracy: true,
            forceRequestLocation: true,
          },
        );
      });
  }, []);

  useEffect(() => {
    if (collectionId && position?.coords && time) {
      // if remaining < 200m (unit km)
      _checkNearDestination();

      // get current time
      const currentTimeFormat = momentTz
        .tz(new Date(), RNLocalize.getTimeZone())
        .clone()
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD HH:mm:ss');

      // get duration by seconds
      const duration = momentTz(currentTimeFormat, 'YYYY-MM-DD HH:mm:ss').diff(
        momentTz(riceHistory.updated_at, 'YYYY-MM-DD HH:mm:ss'),
        'seconds',
      );

      // speed
      const averageSpeed = (riceHistory.average_speed + position.coords.speed * 3.6) / 2;

      // get calories & mining
      const calories =
        (riceHistory.calories || 0) +
        getCalories(averageSpeed || 0, duration); // calculate calories (Kcal)

      console.log('calories', calories);

      const mining = calories && !isFreeBike ? getMining(calories) : 0; // calculate mining
      console.log('mining', mining);

      // update firestore
      cycleHistory
        .doc(collectionId)
        .update({
          address_current: `{"latitude":${position.coords.latitude},"longitude":${position.coords.longitude}}`,
          address_current_json: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          address_from: `{"latitude":${riceHistory?.address_from_json?.latitude},"longitude":${riceHistory?.address_from_json?.longitude}}`,
          address_from_json: {
            latitude: riceHistory?.address_from_json?.latitude,
            longitude: riceHistory?.address_from_json?.longitude,
          },
          'content_json.mining': mining,
          average_speed: averageSpeed,
          distance: riceHistory.distance + 0.02,
          mining,
          calories,
          'content_json.goal':
            riceHistory.goal_setting == 1 && riceHistory.content_json.goal ? riceHistory.content_json.goal : {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          content: `{"mining":${mining},"goal":${
            riceHistory.goal_setting == 1 && riceHistory.content_json.goal
              ? JSON.stringify(riceHistory.content_json.goal)
              : _getTextPosition(position)
          }}`,
          time: hhmmss(duration + time),
          updated_at: currentTimeFormat,
        })
        .then(() => {
          console.log('User updated!');
        })
        .catch(error => console.log('update firestore error:', error));
    }
  }, [position]);

  const _checkNearDestination = () => {
    if (riceHistory.goal_setting === 1) {
      _getRoute(
        {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        },
        {
          latitude: riceHistory?.content_json?.goal?.latitude,
          longitude: riceHistory?.content_json?.goal?.longitude,
        },
      ).then(({distance}) => {
        if (Number(distance) > 0 && Number(distance) < 0.2) {
          setIsNearDestination(true);
        }
      });
    }
  }

  const _getTextPosition = (positionCurrent: any) => {
    return `{"latitude":${positionCurrent?.coords?.latitude},"longitude":${positionCurrent?.coords?.longitude}}`;
  }

  return {
    collectionId,
    position,
  };
};
