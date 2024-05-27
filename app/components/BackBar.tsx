import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

import i18n from 'app/i18n';
import styles from 'app/styles';
import NavigationService from 'app/navigation/NavigationService';

const BackBar: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'android' ? 18 : 50,
          paddingBottom: 12,
        },
        wrapperIcon: {
          width: 30,
          height: 30,
          justifyContent: 'center',
        },
        iconBack: {
          width: 8.43,
          height: 16,
        },
      }),
    [],
  );

  let title = i18n.t(`navigation_header.${route.name}`);

  if (route.name == 'QRCodeScreen') {
    title = route.params?.wallet?.symbol_name;
  } else if (route.name == 'PolygonCoinScreen') {
    title = i18n.t(`navigation_header.${route.name}`, {
      coinName: route.params?.wallet?.coin_name,
    });
  }

  if (route.name == 'EditBodyInformationScreen' && route?.params?.isUpdateBodyInformation) {
    title = i18n.t('navigation_header.CreateBodyInformationScreen');
  }

  const _goBack = () => {
    NavigationService.goBack();
  };

  return (
    <View style={[localStyles.header, { alignItems: 'center' }]}>
      <View
        style={[
          styles.row,
          {
            alignItems: 'center',
            width: '100%',
            justifyContent: route?.params?.isUpdateBodyInformation
              ? 'center'
              : 'space-between',
          },
        ]}>
        {route?.params?.isUpdateBodyInformation ? null : (
          <TouchableOpacity
            onPress={_goBack}
            style={localStyles.wrapperIcon}
          >
            <Image
              source={require('../assets/images/icon-back.png')}
              style={localStyles.iconBack}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        <Text
          style={[
            styles.title,
            { fontSize: 16, fontWeight: '400', alignItems: 'flex-start' },
          ]}
          numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity disabled onPress={_goBack}>
          <Image
            source={require('../assets/images/icon-back.png')}
            style={[localStyles.iconBack, { opacity: 0 }]}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BackBar;
