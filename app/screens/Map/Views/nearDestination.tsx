import i18n from 'app/i18n';
import {
  homeActionSelector,
  homeStateSelector,
  modalActionSelector,
  modalStateSelector,
} from 'app/store';
import styles from 'app/styles';
import {useStoreActions, useStoreState} from 'easy-peasy';
import React, {useMemo, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import momentTz from 'moment-timezone';
import RNLocalize from 'react-native-localize';
import {Button, Dialog, useTheme} from 'react-native-paper';
import { cycleHistory } from 'app/service/firestore';

const currentTime = momentTz
  .tz(new Date(), RNLocalize.getTimeZone())
  .clone()
  .tz('Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const NearDestination: React.FC = () => {
  const {colors}: any = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {isNearDestination} = useStoreState(modalStateSelector);
  const {riceHistory, riceStart, time} = useStoreState(homeStateSelector);
  const {setIsCheckReachedLocationTarget, goRiceEndRoad, getCollectionId, setTimeEnd} =
    useStoreActions(homeActionSelector);
  const {setIsNearDestination} = useStoreActions(modalActionSelector);

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

  const collectionId: null | string = useMemo(() => {
    if (!riceStart?.firestore_collection?.document_id) {
      return null;
    }

    return riceStart?.firestore_collection?.document_id;
  }, [riceStart]);

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

  const _submit = async () => {
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

      setIsNearDestination(false);
    } catch (error) {
      console.log('_endOfRideError', error);
    } finally {
      setIsLoading(false);
    }
  };

  const _cancel = () => {
    setIsNearDestination(false);
  };

  return (
    <Dialog
      visible={isNearDestination}
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
        {i18n.t('nearDestination.title')}
      </Text>
      <Text style={[styles.text16Medium, localStyles.textCompositeInformation]}>
        {i18n.t('nearDestination.content')}
      </Text>
      <View style={[localStyles.wrapperAction]}>
        <Button
          mode="contained"
          onPress={_cancel}
          style={[
            styles.button,
            localStyles.button,
            {backgroundColor: colors.gold_500},
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('nearDestination.cancel')}
        </Button>
        <Button
          mode="contained"
          onPress={_submit}
          style={[
            styles.button,
            localStyles.button,
            {backgroundColor: colors.btn_black},
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={isLoading}>
          {i18n.t('nearDestination.end')}
        </Button>
      </View>
    </Dialog>
  );
};

export default NearDestination;
