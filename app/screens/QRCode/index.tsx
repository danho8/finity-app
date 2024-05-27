import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import FastImage from 'react-native-fast-image';
import styles from '../../styles';
import i18n from 'app/i18n';

const QRCodeScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();

  const [isCopyDone, setIsCopyDone] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        wrapperIconBitcoin: {
          width: 80,
          height: 80,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        iconBitcoin: {
          width: 80,
          height: 80,
          borderRadius: 10,
        },
        item: {
          marginBottom: 18,
          alignSelf: 'center',
        },
        iconCoin: {
          width: 20,
          height: 20,
          marginRight: 10,
        },
        labelButtonBuy: {
          textAlign: 'center',
          textTransform: 'capitalize',
        },
        wrapperInfo: {
          marginTop: 41,
        },
        iconWallet: {
          width: 26,
          height: 26,
        },
        iconFile: {
          width: 18,
          height: 18,
          marginTop: 10,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
        button: {
          marginTop: 30,
        },
        iconFileDone: {
          width: 20,
          height: 20,
        }
      }),
    [],
  );

  const _copyAddress = (item: any) => {
    Clipboard.setString(item?.address);
    setIsCopyDone(true);
  };

  return (
    <SafeAreaView
      style={[localStyles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <View style={[localStyles.item]}>
        <View style={[localStyles.wrapperInfo]}>
          <View style={[localStyles.wrapperIconBitcoin]}>
            <FastImage
              source={
                route.params?.wallet?.image_url
                  ? { uri: route.params?.wallet?.image_url }
                  : require('../../assets/images/GL1.png')
              }
              style={[localStyles.iconBitcoin]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <Text style={[styles.text14SemiBold, { color: colors.gold_500 }]}>
            {route.params?.wallet?.symbol_name}
          </Text>
          <Text style={[styles.text14, { marginTop: 2, fontSize: 16 }]}>
            {route.params?.wallet?.coin_name}
          </Text>
        </View>
      </View>
      <View style={{ alignSelf: 'center', marginTop: 20 }}>
        <QRCode value={route.params?.wallet?.address} size={250} />
      </View>
      <TouchableOpacity
        onPress={() => _copyAddress(route.params?.wallet)}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 32,
            justifyContent: 'center',
            paddingHorizontal: 48,
          },
        ]}>
        {!isCopyDone ? (
          <FastImage
            source={require('../../assets/images/icon-copy.png')}
            style={[localStyles.iconFileDone, { flex: 1 }]}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : (
          <FastImage
            source={require('../../assets/images/icon-copy-done.webp')}
            style={[localStyles.iconFileDone, { flex: 1 }]}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
        <Text
          style={[
            styles.text14Regular,
            {
              marginLeft: 14,
              textDecorationLine: 'underline',
              color: colors.blue,
              flex: 10
            },
          ]}>
          {route.params?.wallet?.address}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.text14, { alignSelf: 'center', marginTop: 14 }]}>
        {i18n.t('qr_coin.address_copy')}
      </Text>
    </SafeAreaView>
  );
};

export default QRCodeScreen;
