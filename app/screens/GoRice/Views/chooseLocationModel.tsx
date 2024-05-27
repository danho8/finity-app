import i18n from 'app/i18n';
import {
  modalStateSelector,
  modalActionSelector,
  settingStateSelector,
  homeActionSelector,
  homeStateSelector,
} from 'app/store';
import styles from 'app/styles';
import { handleAnimation } from 'app/utils/animationPopup';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  Text,
  Keyboard,
  Image,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import {
  durationMs,
  GOOGLE_KEY,
  nativeDriverConfig,
  openedPercent,
} from 'app/config/constant-config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  _checkColorWhenConfirmTargetLocation,
  _disableCheckTargetLocation,
  _getLanguage,
} from 'app/utils/formatString';

interface IRegion {
  latitude: number;
  longitude: number;
}

const _checkStart = (selection: any, inputLength: any) => {
  return (
    selection?.start && selection?.start != 0 && selection?.start != inputLength
  );
};

export function BottomSheetHandleComponent() {
  const { roundness } = useTheme();

  const handleStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 7,
          borderTopLeftRadius: roundness,
          borderTopRightRadius: roundness,
        },

        indicator: {
          alignSelf: 'center',
          width: 60,
          height: 5,
          borderRadius: 4,
          backgroundColor: '#00000033',
        },
      }),
    [],
  );

  return (
    <View style={handleStyles.container}>
      <View style={handleStyles.indicator} />
    </View>
  );
}

export function ChooseLocationModel() {
  const { colors }: any = useTheme();

  const [isLoading] = useState(false);
  const placeRef = useRef();
  const [inputLength, setInputLength] = useState(0);
  const [selection, setSelection] = useState({ start: 0 });
  const [animatedProfileOption] = useState(
    new Animated.Value(Dimensions.get('window').height),
  );
  const windowHeight = Dimensions.get('screen').height;
  const openedPercentage = 0.9;
  const bottomSheetHeight = Math.floor(windowHeight * openedPercentage);
  const heightValue = openedPercentage * openedPercent;
  const heightStyle = { height: `${heightValue}%` };

  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [animation] = useState<Animated.Value>(
    new Animated.Value(bottomSheetHeight * 2),
  );
  const { isChooseLocationVisible } = useStoreState(modalStateSelector);
  const { setIsChooseLocationVisible } = useStoreActions(modalActionSelector);
  const { language } = useStoreState(settingStateSelector);

  const [targetLocation, setTargetLocation] = useState<IRegion | any>();
  const { goRiceStart, setIsGoRiceStart } = useStoreActions(homeActionSelector);
  const {
    dataGoRiceStart,
    isGoRiceStart,
    region: currentRegion,
  } = useStoreState(homeStateSelector);

  const [region, setRegion] = useState<IRegion | any>(currentRegion);

  const bottomSheetStyles = useMemo(
    () => [
      styles.bottomSheet,
      heightStyle,
      {
        transform: [{ translateY: animation }],
      },
    ],
    [heightStyle, animation],
  );

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          flex: 1,
          position: 'relative',
          backgroundColor: colors.white,
          width: Dimensions.get('window').width,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: bottomSheetHeight,
          flexDirection: 'column',
        },
        popupLocationAddress: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          opacity: 0.5,
          zIndex: 1,
          bottom: bottomSheetHeight,
        },
        button: {
          marginBottom: 25,
          marginHorizontal: 8,
          width: (Dimensions.get('screen').width - 50) / 2,
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 10,
          right: 0,
          zIndex: 1,
        },
        iconClose: {
          width: 18,
          height: 18,
        },
        title: {
          marginBottom: 22,
          marginTop: 10,
          alignSelf: 'center',
          textAlign: 'center',
          color: colors.text_content_gray,
        },
        map: {
          flex: 5,
          width: '100%',
        },
        wrapperTextMarker: {
          backgroundColor: colors.gray_200,
          paddingVertical: 5,
          paddingHorizontal: 15,
          marginTop: 5,
        },
      }),
    [bottomSheetHeight],
  );

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    handleAnimation(isChooseLocationVisible, animatedProfileOption);
  }, [isChooseLocationVisible]);

  useEffect(() => {
    if (isGoRiceStart) {
      setIsGoRiceStart(false);
      _onPressClose();
    }
  }, [isGoRiceStart]);

  const [pan] = useState<Animated.ValueXY>(new Animated.ValueXY());
  const [panResponder] = useState(
    PanResponder.create({
      // onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (bottomSheetHeight - 20 > windowHeight - gestureState?.moveY) {
          return false;
        }
        return true;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x?._value,
          y: pan.y?._value,
        });
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy >= 0) {
          Animated.timing(animation, {
            toValue: gestureState.dy,
            duration: 0,
            ...nativeDriverConfig,
          }).start();
        }

        return Animated.event([null, { dx: pan.x, dy: pan.y }], {
          ...nativeDriverConfig,
        });
      },
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();
        if (gestureState.dy < bottomSheetHeight / 2) {
          Animated.timing(animation, {
            toValue: 0,
            duration: durationMs,
            ...nativeDriverConfig,
          }).start();
        } else {
          _onPressClose();
        }
      },
    }),
  );

  useEffect(() => {
    if (isChooseLocationVisible) {
      setDrawerOpen(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: durationMs,
        ...nativeDriverConfig,
      }).start();
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => setDrawerOpen(false), durationMs);
      });
      Animated.timing(animation, {
        toValue: bottomSheetHeight * 2,
        duration: durationMs,
        ...nativeDriverConfig,
      }).start();
    }
  }, [isChooseLocationVisible]);

  const _onPressClose = () => {
    setIsChooseLocationVisible(false);
  };

  const _freeMovement = async () => {
    await _goRiceStart(0);
  };

  const _goRiceStart = async (goalSetting: number) => {
    await goRiceStart({
      product_inventory_id: dataGoRiceStart?.product_inventory_id,
      goal_setting: goalSetting,
      latitude: targetLocation?.latitude,
      longitude: targetLocation?.longitude,
      address_from: region,
    });
    _onPressClose();
  };

  const _confirmTargetLocation = async () => {
    await _goRiceStart(1);
  };

  useEffect(() => {
    if (_checkStart(selection, inputLength)) {
      setSelection({
        start: inputLength,
      });
    }
  }, [inputLength]);

  const handleDeleteAddress = () => {
    placeRef.current?.setAddressText('');
    setInputLength(0);
    setSelection({
      start: 0,
    });
  };

  const _chooseTargetLocation = (e: any) => {
    e.stopPropagation();
    setTargetLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const _renderCurrentSearch = useMemo(
    () => (
      <View>
        <GooglePlacesAutocomplete
          autoFillOnNotFound={true}
          placeholder={i18n.t('go_rice.please_enter_your_current_address')}
          fetchDetails={true}
          GooglePlacesDetailsQuery={{
            rankby: 'distance',
          }}
          onPress={(data, details = null) => {
            setRegion({
              latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
            });
          }}
          query={{
            key: GOOGLE_KEY,
            language: _getLanguage(language),
          }}
          styles={{
            container: {
              paddingHorizontal: 16,
            },
            textInput: {
              borderColor: colors.gray_200,
              borderWidth: 1,
              borderRadius: 10,
              color: colors.text_content_gray,
              paddingRight: '10%',
            },
            description: {
              color: colors.text_content_gray,
            },
          }}
        />
      </View>
    ),
    [language],
  );

  const _renderTargetSearch = useMemo(
    () => (
      <View>
        <GooglePlacesAutocomplete
          autoFillOnNotFound={true}
          ref={placeRef}
          placeholder={i18n.t('go_rice.please_enter_your_address')}
          fetchDetails={true}
          GooglePlacesDetailsQuery={{
            rankby: 'distance',
          }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            setTargetLocation({
              latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
            });
          }}
          query={{
            key: GOOGLE_KEY,
            language: _getLanguage(language),
          }}
          styles={{
            container: {
              paddingHorizontal: 16,
              zIndex: 1,
            },
            textInput: {
              borderColor: colors.gray_200,
              borderWidth: 1,
              borderRadius: 10,
              color: colors.text_content_gray,
              paddingRight: '10%',
            },
            description: {
              color: colors.text_content_gray,
            },
          }}
        />
      </View>
    ),
    [language],
  );

  const _renderMap = useMemo(
    () => (
      <MapView
        provider={__DEV__ ? undefined : PROVIDER_GOOGLE}
        style={[localStyles.map]}
        onPress={_chooseTargetLocation}
        region={{
          latitude: targetLocation?.latitude || region.latitude,
          longitude: targetLocation?.longitude || region.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}>
        <Marker coordinate={region} draggable={true} zIndex={2}>
          <View>
            <Image
              source={require('../../../assets/images/icon-place.png')}
              style={{ width: 20, height: 25, alignSelf: 'center' }}
            />
            <View style={[localStyles.wrapperTextMarker]}>
              <Text
                style={[styles.text12Regular, { color: colors.white }]}>
                {i18n.t('go_rice.my_location')}
              </Text>
            </View>
          </View>
        </Marker>
        {targetLocation && (
          <Marker
            coordinate={{
              latitude: targetLocation.latitude,
              longitude: targetLocation.longitude,
            }}
            draggable={true}
            zIndex={2}>
            <View>
              <Image
                source={require('../../../assets/images/icon-place.png')}
                style={{ width: 20, height: 25, alignSelf: 'center' }}
              />
              <View style={[localStyles.wrapperTextMarker]}>
                <Text
                  style={[styles.text12Regular, { color: colors.white }]}>
                  {i18n.t('go_rice.target_location')}
                </Text>
              </View>
            </View>
          </Marker>
        )}
      </MapView>
    ),
    [targetLocation, region],
  );

  const _renderAction = () => (
    <View style={[{ position: 'absolute', bottom: 0, width: '100%' }]}>
      <View
        style={[styles.row, { justifyContent: 'center', flexWrap: 'nowrap' }]}>
        {targetLocation && (
          <Button
            mode="contained"
            onPress={_freeMovement}
            style={[
              styles.button,
              localStyles.button,
              { backgroundColor: colors.btn_black },
            ]}
            uppercase={true}
            labelStyle={[styles.labelButton]}
            disabled={isLoading}
            loading={isLoading}>
            {i18n.t('go_rice.free_movement')}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={_confirmTargetLocation}
          style={[
            styles.button,
            localStyles.button,
            {
              backgroundColor: _checkColorWhenConfirmTargetLocation(
                targetLocation,
                colors.btn_black,
                colors.primary,
              ),
            },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, { width: '100%', marginHorizontal: 10 }]}
          disabled={_disableCheckTargetLocation(isLoading, targetLocation)}
          loading={isLoading}>
          {i18n.t('go_rice.destination_setting')}
        </Button>
      </View>
    </View>
  );

  return isDrawerOpen ? (
    <>
      <View style={styles.bottomSheetContainer}>
        <TouchableOpacity
          style={[localStyles.popupLocationAddress]}
          onPress={_onPressClose}
        />
        <View style={styles.animationContainer}>
          <Animated.View
            style={bottomSheetStyles}
            {...panResponder.panHandlers}>
            <View style={localStyles.contentContainer}>
              {/* <BottomSheetHandleComponent /> */}
              <View style={{ paddingHorizontal: 16 }}>
                <View style={{ marginTop: 16 }}>
                  <View style={[localStyles.wrapperIconClose]}>
                    <TouchableOpacity onPress={_onPressClose}>
                      <Image
                        source={require('../../../assets/images/icon-close.png')}
                        style={localStyles.iconClose}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.title, localStyles.title]}>
                  {i18n.t('go_rice.target_point_setting')}
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  zIndex: 5,
                  top: 60,
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                }}>
                {_renderCurrentSearch}
                <Text
                  style={[
                    styles.text14Regular,
                    { marginBottom: 10, paddingHorizontal: 16, marginTop: 10 },
                  ]}>
                  {i18n.t('go_rice.address_search')}
                </Text>
                {_renderTargetSearch}
              </View>
              {_renderMap}
              {_renderAction()}
            </View>
          </Animated.View>
        </View>
      </View>
    </>
  ) : null;
}
