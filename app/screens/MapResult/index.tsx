import {useNavigation, useRoute} from '@react-navigation/native';
import i18n from 'app/i18n';
import styles from 'app/styles';
import React, {useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import FastImage from 'react-native-fast-image';
import {Button, useTheme} from 'react-native-paper';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_KEY} from 'app/config/constant-config';
import {authStateSelector, homeStateSelector, settingStateSelector} from 'app/store/index';
import {useStoreState} from 'easy-peasy';

const MapScreen: React.FC = () => {
  const {colors}: any = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const {language} = useStoreState(settingStateSelector);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [rateImageBicycle, setRateImageBicycle] = useState(0);

  const { riceHistory } = useStoreState(homeStateSelector);
  const { historiesCycleDetail } = useStoreState(authStateSelector);

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

  const _renderDetail = useMemo(
    () => (
      <View
        style={[
          localStyles.wrapperDetail,
          {backgroundColor: colors.backgroundtabar},
        ]}>
        <Text
          style={[
            styles.text18Regular,
            {color: colors.text_content, marginBottom: 5},
          ]}>
          {i18n.t('go_rice.travel_distance')}:{' '}
          <Text style={[styles.text20Regular, {color: colors.primary}]}>
            {Number(route?.params?.distance || 0).toFixed(2)}
          </Text>
          {i18n.t('km')}
        </Text>
        <Text
          style={[
            styles.text18Regular,
            {color: colors.text_content, marginBottom: 5},
          ]}>
          {i18n.t('go_rice.time')}:{' '}
          <Text style={[styles.text18Regular, {color: colors.primary}]}>
            {route?.params?.time}
          </Text>
        </Text>
      </View>
    ),
    [route?.params],
  );

  const _renderRemainingDistance = useMemo(
    () => (
      <View style={[localStyles.wrapperDetail]}>
        <Text
          style={[
            styles.text18Regular,
            {color: colors.text_content, marginBottom: 5},
          ]}>
          {i18n.t('go_rice.remaining_distance')}:{' '}
          <Text style={[styles.text20Regular, {color: colors.primary}]}>
            {Number(remainingDistance).toFixed(2)}
          </Text>
          {i18n.t('km')}
        </Text>
      </View>
    ),
    [remainingDistance],
  );

  return (
    <View style={[localStyles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <MapView
        provider={__DEV__ ? undefined : PROVIDER_GOOGLE}
        style={[localStyles.map]}
        region={{
          ...route?.params?.from,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}>
        <Marker tracksViewChanges={false} coordinate={route?.params?.from}>
          <Image
            source={require('../../assets/images/icon-place.png')}
            style={{width: 20, height: 25, alignSelf: 'center'}}
            resizeMode="contain"
          />
        </Marker>
        {!!route?.params?.to?.latitude &&
          !!route?.params?.to?.longitude && (
            <Marker tracksViewChanges={false} coordinate={route?.params?.to}>
              <FastImage
                source={
                  historiesCycleDetail?.product_inventory?.image_url
                    ? {
                      uri: historiesCycleDetail?.product_inventory
                        ?.image_url,
                    }
                    : require('../../assets/images/icon-bike.png')
                }
                style={{
                  width: rateImageBicycle * 35,
                  height: 35,
                }}
                resizeMode="contain"
                onLoad={({nativeEvent: {width, height}}) => {
                  setRateImageBicycle((width/height));
                }}
              />
              {!rateImageBicycle && (
                <View style={{opacity: 0}}>
                  <Text>{rateImageBicycle}</Text>
                </View>
              )}
            </Marker>
          )}
        {riceHistory?.content_json?.goal && (
          <MapViewDirections
            mode="TRANSIT"
            origin={route?.params?.from}
            destination={route?.params?.to}
            apikey={GOOGLE_KEY}
            lineDashPattern={[0]}
            strokeWidth={5}
            strokeColor={colors.blue}
            language={language === 'kr' ? 'ko' : language}
            onReady={result => {
              setRemainingDistance(result.distance);
            }}
            resetOnChange={true}
          />
        )}
      </MapView>
      <View style={[{position: 'absolute', top: 12, left: 16}]}>
        {_renderDetail}
      </View>
      <View style={[{position: 'absolute', top: 12, right: 16}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/icon-close-map.png')}
            style={localStyles.iconCloseMap}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      {/* <View style={[{position: 'absolute', bottom: 90, left: 16}]}>
        {_renderRemainingDistance}
      </View> */}
      <View style={[{position: 'absolute', bottom: 0, width: '100%'}]}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={[
            styles.button,
            localStyles.button,
            {backgroundColor: colors.btn_black},
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton]}>
          {i18n.t('go_rice.close_map')}
        </Button>
      </View>
    </View>
  );
};

export default MapScreen;
