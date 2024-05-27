import NavigationService from 'app/navigation/NavigationService';
import {
  authActionSelector,
  authStateSelector,
  homeActionSelector,
} from 'app/store';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Clipboard from '@react-native-community/clipboard';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import styles from '../../styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { _abbreviateNumber, formatMoneyTow } from 'app/utils/formatString';

const CoinSituationScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);
  const [listCopyDone, setListCopyDone] = useState([
    {
      id: 1,
      isCopyDone: false,
    },
    {
      id: 2,
      isCopyDone: false,
    }
  ]);
  const { getWallets } = useStoreActions(authActionSelector);
  const { wallets } = useStoreState(authStateSelector);
  const { updateWallet } = useStoreActions(homeActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          backgroundColor: colors.background,
        },
        imageBackground: {
          flex: 1,
          justifyContent: 'space-between',
        },
        button: {
          borderColor: colors.white,
          borderRadius: 20,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 2,
          borderBottomWidth: 3,
        },
        styleFlatList: {
          marginTop: 18,
        },
        flatList: {},
        wrapperIconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        iconBitcoin: {
          width: 70,
          height: 70,
          borderRadius: 10,
        },
        item: {
          paddingVertical: 16,
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 20,
        },
        iconCoin: {
          width: 20,
          height: 20,
          marginRight: 10,
        },
        buttonBuy: {
          backgroundColor: colors.yellow,
          width: 51,
          height: 20,
          borderRadius: 5,
        },
        labelButtonBuy: {
          textAlign: 'center',
          textTransform: 'capitalize',
        },
        wrapperInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        iconWallet: {
          width: 18,
          height: 18,
        },
        iconFile: {
          width: 18,
          height: 20,
        },
        iconFileDone: {
          width: 20,
          height: 27,
        },
        buttonUpdate: {
          paddingVertical: 2,
          paddingHorizontal: 0,
          marginTop: 5,
          width: 90,
          borderRadius: 8,
        },
        labelButtonUpdate: {
          fontSize: 12,
          textTransform: 'capitalize',
          textAlign: 'center',
        },
        separator: {
          height: 1,
          width: '100%',
          backgroundColor: colors.backgroundContent,
        },
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        await getWallets();
      });
    });
  }, [navigation]);

  useEffect(() => {
    if (!isFocused) {
      setListCopyDone([
        {
          id: 1,
          isCopyDone: false,
        },
        {
          id: 2,
          isCopyDone: false,
        },
      ])
    }
  }, [isFocused])

  const _redirectToPolygonCoin = (item: any) => {
    NavigationService.navigate('PolygonCoinScreen', { wallet: item });
  };
  const _copyAddress = (item: any, index: number) => {
    Clipboard.setString(item?.address);

    let listCopyDoneTem = JSON.parse(JSON.stringify(listCopyDone));
    listCopyDoneTem[index].isCopyDone = true;
    setListCopyDone(listCopyDoneTem);
  };

  const _redirectQRCode = (item: any) => {
    NavigationService.navigate('QRCodeScreen', { wallet: item });
  };

  const itemSeparator = () => {
    return <View style={[localStyles.separator]}></View>;
  };
  const _update = async (item: any) => {
    setIsLoading(true);
    await updateWallet({
      coin_id: item?.id,
    });
    await getWallets();
    setIsLoading(false);
  };

  const _renderItem = useCallback(
    (item: any, index: number) => (
      <TouchableOpacity
        onPress={() => _redirectToPolygonCoin(item)}
        style={[styles.button, localStyles.item]}>
        <View style={[localStyles.wrapperInfo]}>
          <View style={[localStyles.wrapperIconBitcoin]}>
            <FastImage
              source={
                item?.image_url
                  ? { uri: item?.image_url }
                  : require('../../assets/images/GL1.png')
              }
              style={[localStyles.iconBitcoin]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginLeft: 12,
            width: Dimensions.get('screen').width - 145,
          }}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={{ marginRight: 10 }}>
              <Text style={[styles.text14SemiBold, { color: colors.gold_500 }]}>
                {item?.symbol_name}
              </Text>
              <Text
                style={[styles.text12Regular, { marginTop: 5, fontSize: 14 }]}>
                {item?.coin_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
                flex: 3,
              }}>
              <View style={[styles.row, { alignItems: 'center' }]}>
                <Text
                  style={[styles.text14SemiBold, { color: colors.gold_500 }]}>
                  {
                    item?.amount < 1
                      ? formatMoneyTow(item?.amount)
                      : _abbreviateNumber(item?.amount)
                  } {item?.symbol_name}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <TouchableOpacity
              onPress={() => _redirectQRCode(item)}
              style={[styles.row, { marginTop: 5, flex: 10 }]}>
              <FastImage
                source={require('../../assets/images/icon-wallet.png')}
                style={localStyles.iconWallet}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.text12Regular,
                  // eslint-disable-next-line react-native/no-inline-styles
                  { paddingTop: 5, marginLeft: 8, width: '85%', fontSize: 10 },
                ]}>
                {item?.address}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => _copyAddress(item, index)}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ flex: 1, marginTop: 2 }}>
              {!listCopyDone[index]?.isCopyDone ? (
                <FastImage
                  source={require('../../assets/images/icon-copy.png')}
                  style={[localStyles.iconFile, { alignSelf: 'flex-end' }]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : (
                <FastImage
                  source={require('../../assets/images/icon-copy-done.webp')}
                  style={[localStyles.iconFileDone, { alignSelf: 'flex-end' }]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, listCopyDone],
  );

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <FlatList
        style={[localStyles.styleFlatList]}
        contentContainerStyle={[localStyles.flatList]}
        data={wallets}
        numColumns={1}
        ItemSeparatorComponent={itemSeparator}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => JSON.stringify(item).toString() + index}
        renderItem={({ item, index }: any) => _renderItem(item, index)}
      />
    </View>
  );
};

export default CoinSituationScreen;
