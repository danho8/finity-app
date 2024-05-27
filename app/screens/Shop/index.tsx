import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from 'app/i18n';
import {
  modalActionSelector,
  modalStateSelector,
  shopActionSelector,
  shopStateSelector,
} from 'app/store';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Orientation from 'react-native-orientation';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity, FlatList, Image, RefreshControl, Platform, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../../styles';
import FastImage from 'react-native-fast-image';
import { _abbreviateNumber } from 'app/utils/formatString';

const ShopScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [tab] = useState(1);
  const [page, setPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setIsBugVisible, setIsUpgradeVisible, setIsInformationItemVisible } =
    useStoreActions(modalActionSelector);
  const {
    isSendItemToUserVisible,
    isUpgradeVisible,
    isUpgradeSuccessVisible,
    isBuyVisible,
  } = useStoreState(modalStateSelector);
  const { setCoin, getListShop, getStatusFunctions } = useStoreActions(shopActionSelector);
  const { listShop, isStatusFunctions } = useStoreState(shopStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          backgroundColor: colors.background,
        },
        button: {
          borderColor: colors.white,
          borderRadius: 20,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 2,
          borderBottomWidth: 3,
        },
        wrapperIconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
          justifyContent: 'center',
          alignItems: 'center',
        },
        wrapperLine: {
          borderBottomColor: colors.backgroundContent,
          borderBottomWidth: 1,
          paddingVertical: 18,
        },
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
          padding: 5,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
        },
        item: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        },
        iconCoin: {
          width: 24,
          height: 24,
        },
        buttonBuy: {
          width: 50,
          height: 20,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
        labelButtonBuy: {
          textTransform: 'none',
          color: colors.white,
          lineHeight: 14.4,
          borderRadius: 5,
        },
        wrapperInfo: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: (Platform?.OS != 'ios' || isStatusFunctions) ? 'space-between' : 'flex-start',
        },
        iconNotItem: {
          width: 100,
          height: 100,
        },
        buttonShop: {
          borderRadius: 10,
        },
        labelButton: {
          textTransform: 'capitalize',
          width: 100,
        },
        textMatic: {
          color: colors.primary,
          padding: 5,
        },
        text16: {
          marginTop: 55,
          marginBottom: 25,
          textAlign: 'center',
        },
        iconCheck: {
          width: 14,
          height: 14,
          position: 'absolute',
          top: 5,
          left: 5,
        },
        itemUnit: {
          width: 39,
          height: 39,
          margin: 1,
          justifyContent: 'center',
          borderRadius: 24,
          backgroundColor: colors.gray_400,
        },
        textUnit: {
          fontSize: 10,
          fontWeight: 'bold',
          alignSelf: 'center',
          color: colors.gray_800,
        },
        textPrice: {
          color: colors.primary,
          paddingVertical: 10,
          marginLeft: 5,
        },
        wrapperHollow: {
          paddingTop: 70,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }),
    [],
  );

  useEffect(() => {
    _handleRefresh();
  }, []);

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      Orientation.lockToPortrait();
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      });
      await getListShop({
        paginate_size: page + 10,
      });
    });
  }, [navigation, route]);

  const _getDataFunction = async () => {
    await getStatusFunctions();
  }
  useEffect(() => {
    _handleLoadMore();
    _getDataFunction();
  }, [
    tab,
    isSendItemToUserVisible,
    isUpgradeVisible,
    isUpgradeSuccessVisible,
    isBuyVisible,
  ]);

  const _buy = (e: any, item: any) => {
    e.preventDefault();
    if (item?.product_inventory[0]) {
      if (!(Platform?.OS != 'ios' || isStatusFunctions)) {
        Alert.alert(i18n.t('shop.purchased_product'));
        return;
      }
      if (item?.product_inventory[0]?.level < 30) {
        setIsUpgradeVisible(true);
      } else {
        setIsInformationItemVisible(true);
      }
    } else {
      setIsBugVisible(true);
    }
    setCoin(item);
  };

  const _handleLoadMore = async () => {
    setPage(page + 10);
    await getListShop({
      paginate_size: page + 10,
    });
  };
  const _handleRefresh = async () => {
    setPage(20);
    await getListShop({
      paginate_size: 10,
    });
    setIsRefreshing(false);
  };

  const _renderItemEmpty = useMemo(
    () => (
      <View style={[localStyles.wrapperHollow]}>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={[
              styles.text14Regular,
              { marginVertical: 24, textAlign: 'center' },
            ]}>
            {i18n.t('no_data')}
          </Text>
        </View>
      </View>
    ),
    [listShop],
  );

  const _renderItem = useCallback(
    (item: any, index: number) => (
      <TouchableOpacity onPress={e => _buy(e, item)}>
        <View style={[localStyles.wrapperLine]}>
          <View style={[styles.button, localStyles.item]}>
            <View style={[localStyles.wrapperInfo]}>
              <View style={[localStyles.wrapperIconBitcoin]}>
                <FastImage
                  source={
                    item?.image_url
                      ? {
                        uri: item?.image_url,
                        headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                      }
                      : require('../../assets/images/icon-bike.png')
                  }
                  style={[localStyles.iconBitcoin]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text
                  numberOfLines={1}
                  style={[styles.text14Medium, { color: colors.black }]}>
                  {item?.name_glass}
                </Text>
                <Text
                  style={[
                    styles.text12Regular,
                    { marginTop: 4, color: colors.hint },
                  ]}>
                  {item?.description}
                </Text>
                {(Platform?.OS != 'ios' || isStatusFunctions) && (
                  <View style={[styles.row]}>
                    {!item?.product_inventory[0]
                      ? item?.prices.map((coinPrice: any) => (
                        <View style={[styles.row]}>
                          <View style={[localStyles.itemUnit]}>
                            <Text style={[localStyles.textUnit]}>
                              {coinPrice?.unit}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.text14SemiBold,
                              localStyles.textPrice,
                            ]}>
                            {_abbreviateNumber(coinPrice?.amount) +
                              ' ' +
                              coinPrice?.unit}
                          </Text>
                        </View>
                      ))
                      : item?.product_inventory[0]?.product_upgrade.map(
                        (upgradePrice: any) => (
                          <View style={[styles.row]}>
                            <View style={[localStyles.itemUnit]}>
                              <Text style={[localStyles.textUnit]}>
                                {upgradePrice?.unit}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.text14SemiBold,
                                localStyles.textPrice,
                              ]}>
                              {_abbreviateNumber(upgradePrice?.amount) +
                                ' ' +
                                upgradePrice?.unit}
                            </Text>
                          </View>
                        ),
                      )}
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={e => _buy(e, item)}
                style={[
                  styles.button,
                  localStyles.buttonBuy,
                  {
                    display: (!item?.product_inventory[0] || Platform?.OS != 'ios' || isStatusFunctions) ? 'flex' : 'none',
                    backgroundColor: !item?.product_inventory[0]
                      ? colors.blue
                      : colors.gray_800,
                  },
                ]}
                disabled={isLoading}>
                <Text style={[styles.text12Bold, localStyles.labelButtonBuy]}>
                  {!item?.product_inventory[0]
                    ? i18n.t('shop.buy_button')
                    : `${i18n.t('shop.lv')}${item?.product_inventory[0]?.level
                    }`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [i18n],
  );

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      {listShop[0] ? (
        <FlatList
          data={listShop}
          numColumns={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => JSON.stringify(item).toString() + index}
          renderItem={({ item, index }: any) => _renderItem(item, index)}
          onEndReached={_handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              title={i18n.t('pull_to_refresh')}
              tintColor={colors.primary}
              titleColor={colors.primary}
              colors={[colors.primary, 'green', 'blue']}
              refreshing={isRefreshing}
              onRefresh={_handleRefresh}
            />
          }
          ListEmptyComponent={() => _renderItemEmpty}
        />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.text16Medium, localStyles.text16]}>
            {i18n.t('inventory.not_item')}
          </Text>
          <Image
            source={require('../../assets/images/image-not-item.png')}
            style={localStyles.iconNotItem}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.text14Regular,
              { marginVertical: 19, textAlign: 'center' },
            ]}>
            {i18n.t('inventory.content_not_item')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ShopScreen;
