import { modalStateSelector } from 'app/store';
import { useStoreState } from 'easy-peasy';
import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import FastImage from "react-native-fast-image";

const LoadingModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { isLoadingVisible } = useStoreState(modalStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: colors.white,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: colors.transparent,
        },
        iconLoading: {
          width: 80,
          height: 80,
          tintColor: '#B0B0B0',
        },
        title: {
          marginTop: 21,
          alignSelf: 'center',
          fontSize: 20,
          color: '#B0B0B0',
        },
      }),
    [],
  );

  return (
    <>
      {isLoadingVisible ? (
        <View style={[localStyles.container]}>
          <FastImage
            source={require('../assets/images/icon-loading.gif')}
            style={localStyles.iconLoading}
            resizeMode="cover"
          />
          <Text style={localStyles.title}>Loading...</Text>
        </View>
      ) : null}
    </>
  );
};

export default LoadingModel;
