import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import NavigationService from 'app/navigation/NavigationService';
import { useStoreState } from 'easy-peasy';
import { authStateSelector, shopStateSelector } from '../store';
import { _abbreviateNumber, formatMoneyTow } from 'app/utils/formatString';
import styles from 'app/styles';

const HomeBar: React.FC = () => {
  const { colors }: any = useTheme();
  const [walletsState, setWalletsState] = useState<any[]>([]);

  const { user, wallets } = useStoreState(authStateSelector);
  const { isStatusFunctions } = useStoreState(shopStateSelector);

  useEffect(() => {
    if (wallets[0] && wallets[1]) {
      setWalletsState([wallets[0], wallets[1]]);
    }
  }, [wallets[0]?.amount, wallets[1]?.amount]);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: 'row',
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'android' ? 12 : 50,
          paddingBottom: 12,
          justifyContent: 'space-between',
        },
        tinyLogo: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        textLogo: {
          fontSize: 12,
          fontWeight: 'bold',
          marginRight: 10,
          marginTop: 12,
        },
        layout: {
          color: colors.text_content,
          borderColor: colors.gold_500,
          borderRadius: 10,
          backgroundColor: colors.gold_500,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          paddingVertical: 4,
          paddingHorizontal: 10,
        },
        iconCoin: {
          width: 22,
          height: 22,
        },
        iconAvatar: {
          width: 40,
          height: 40,
          borderRadius: 50,
        },
        iconDoText: {
          color: colors.white,
          fontSize: 12,
          fontWeight: 'bold',
          lineHeight: 15,
          marginHorizontal: 5,
        },
      }),
    [],
  );

  const _redirectToProfileScreen = () => {
    NavigationService.navigate('ProfileScreen');
  };

  const _redirectToCoinSituation = () => {
    NavigationService.navigate('CoinSituationScreen');
  };

  return (
    <View style={[localStyles.header]}>
      <TouchableOpacity onPress={_redirectToProfileScreen}>
        <View style={localStyles.tinyLogo}>
          <Image
            source={{ uri: user?.avatar || user?.uri }}
            style={localStyles.iconAvatar}
          />
        </View>
      </TouchableOpacity>
      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            width: Dimensions.get('window').width - 82,
          },
        ]}>
        <TouchableOpacity onPress={_redirectToProfileScreen}>
          <Text style={localStyles.textLogo}>{user?.full_name}</Text>
        </TouchableOpacity>
        {walletsState[0] && walletsState[1] && (Platform?.OS != 'ios' || isStatusFunctions) && (
          <TouchableOpacity
            onPress={_redirectToCoinSituation}
            style={[localStyles.layout]}>
            {walletsState?.map((wallet, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 7,
                }}>
                <Image
                  source={
                    wallet?.coin_id == 1
                      ? require('../assets/images/GL1.png')
                      : require('../assets/images/GL2.png')
                  }
                  style={localStyles.iconCoin}
                />
                <Text
                  style={[
                    localStyles.iconDoText,
                    { marginRight: index == 0 ? 15 : 3 },
                  ]}>
                  {wallet?.amount < 1
                    ? formatMoneyTow(wallet?.amount)
                    : _abbreviateNumber(wallet?.amount)}
                </Text>
              </View>
            ))}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomeBar;
