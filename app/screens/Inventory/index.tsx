import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import { enumProductInventory } from 'app/service/interface/shop.interface';
import {
  modalActionSelector,
  modalStateSelector,
  shopActionSelector,
  shopStateSelector,
} from 'app/store';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Orientation from 'react-native-orientation';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { Button, Menu, useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { storage } from 'app/store/storage';
import styles from '../../styles';
import MergeItems from './Views/mergeItems';

const InventoryScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [page, setPage] = useState(0);
  const [language, setLanguage] = useState('en');
  const { setIsReliabilityFeeVisible, setIsInformationItemVisible } =
    useStoreActions(modalActionSelector);
  const {
    isMergeItemsVisible,
    isInformationItemVisible,
    isReliabilityFeeVisible,
    isSendItemToUserSuccessVisible,
    isSendItemToUserVisible,
    isUpgradeVisible,
    isUpgradeSuccessVisible,
    isBuyVisible,
  } = useStoreState(modalStateSelector);
  const { setCoin, setListCoinMerge, productInventory, setListInventory, getStatusFunctions } =
    useStoreActions(shopActionSelector);
  const { listInventory, isGiveProduct, isStatusFunctions } = useStoreState(shopStateSelector);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isShowMergeItems, setShowIsMergeItems] = useState(false);
  const [isMergeItems, setIsMergeItems] = useState(false);
  const [filterType, setFilterType] = useState({
    id: 1,
    name: i18n.t('inventory.nearest_buy'),
  });
  const [listFilter, setListFilter] = useState([
    {
      id: 1,
      name: i18n.t('inventory.nearest_buy'),
    },
    {
      id: 2,
      name: i18n.t('inventory.high_level'),
    },
    {
      id: 3,
      name: i18n.t('inventory.high_durability'),
    },
  ]);

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
        tab: {
          paddingHorizontal: 21,
          paddingVertical: 7,
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
          flex: 1,
        },
        flatList: {
          paddingBottom: 50,
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
        iconBitcoin: {
          width: 73,
          height: 73,
          borderRadius: 10,
        },
        item: {
          paddingHorizontal: 16,
          paddingVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        iconCoin: {
          width: 20,
          height: 20,
          marginRight: 10,
        },
        buttonBuy: {
          backgroundColor: colors.gray_700,
          width: 51,
          borderRadius: 5,
        },
        labelButtonBuy: {
          textAlign: 'center',
          textTransform: 'capitalize',
          alignItems: 'center',
        },
        wrapperInfo: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        menu: { marginTop: 32 },
        contentStyleMenu: {},
        wrapperMenu: {
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 10,
          borderRadius: 10,
        },
        wrapperItem: {
          width: Dimensions.get('screen').width / 3,
        },
        iconDropdown: {
          width: 12,
          height: 8,
          marginLeft: 10,
        },
        styleFlatListFilter: {},
        flatListFilter: {},
        btnAllItem: {
          width: (Dimensions.get('screen').width - 32) * 0.37,
          backgroundColor: colors.accent,
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        iconNotItem: {
          width: 140,
          height: 140,
        },
        buttonShop: {
          borderRadius: 5,
          width: '90%',
          height: 40,
        },
        labelButton: {
          textTransform: 'capitalize',
          fontSize: 16,
          color: 'white',
          letterSpacing: 0.5,
        },
        iconCheck: {
          width: 14,
          height: 14,
          position: 'absolute',
          top: 5,
          left: 5,
        },
        level: {
          position: 'absolute',
          width: '80%',
          height: 18,
          bottom: 5,
          right: 5,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
        },
        durability: {
          marginTop: 9,
          color: colors.white,
          backgroundColor: colors.pink_s,
          paddingVertical: 1,
          paddingHorizontal: 8,
          borderRadius: 5,
        },
        customButton: {
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomLeftRadius: 5,
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
          borderBottomRightRadius: 5,
          backgroundColor: colors.blue,
          width: 73,
          height: 25,
          marginTop: 10,
        },
        itemSeparator: {
          height: 1,
          width: '100%',
          backgroundColor: colors.backgroundContent,
        },
      }),
    [],
  );

  const itemSeparator = () => {
    return <View style={localStyles.itemSeparator} />;
  };

  const getLanguage = async () => {
    const value = await storage.getItem('language');
    setLanguage(value);
  };

  useEffect(() => {
    if (route?.params?.unUsable) {
      setTab(2);
    }
  }, [route]);

  useEffect(() => {
    getLanguage();
    _getDataFunction();
  }, []);
  const _getDataFunction = async () => {
    await getStatusFunctions();
  }
  useEffect(() => {
    return navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
      setIsLoading(true);
      setTab(1);
      getLanguage();
      setTimeout(() => {
        setIsLoading(false);
        setFilterType({
          id: 1,
          name: i18n.t('inventory.nearest_buy'),
        });
        setListFilter([
          {
            id: 1,
            name: i18n.t('inventory.nearest_buy'),
          },
          {
            id: 2,
            name: i18n.t('inventory.high_level'),
          },
          {
            id: 3,
            name: i18n.t('inventory.high_durability'),
          },
        ]);
      });
    });
  }, [navigation]);

  useEffect(() => {
    _handleLoadStart();
  }, [tab, filterType]);

  useEffect(() => {
    _handleLoadMore();
  }, [
    isMergeItemsVisible,
    isInformationItemVisible,
    isReliabilityFeeVisible,
    isGiveProduct,
    isSendItemToUserSuccessVisible,
    isSendItemToUserVisible,
    isUpgradeVisible,
    isUpgradeSuccessVisible,
    isBuyVisible,
  ]);

  const _handleLoadStart = async () => {
    setIsLoading(true);
    setPage(20);
    setListInventory([]);
    await productInventory({
      can_use:
        tab == 1 ? enumProductInventory.can : enumProductInventory.canNot,
      paginate_size: 10,
      level: filterType?.id == 2 ? 1 : 0,
      durability: filterType?.id == 3 ? 1 : 0,
      most_recently_purchase: filterType?.id == 1 ? 1 : 0,
    });
    setIsLoading(false);
  };


  const _handleLoadMore = async () => {
    setPage(page + 10);
    await productInventory({
      can_use:
        tab == 1 ? enumProductInventory.can : enumProductInventory.canNot,
      paginate_size: page + 10,
      level: filterType?.id == 2 ? 1 : 0,
      durability: filterType?.id == 3 ? 1 : 0,
      most_recently_purchase: filterType?.id == 1 ? 1 : 0,
    });
  };

  const _buy = (item: any) => {
    setIsInformationItemVisible(true);
    setCoin(item);
  };

  const _chooseFilter = (item: any) => {
    setMenuVisible(false);
    setFilterType(item);
  };

  const _handleReliability = (item: any) => {
    if (item?.durability < 100) {
      setIsReliabilityFeeVisible(true);
      setCoin(item);
    }
  };

  const _redirectToShop = () => {
    NavigationService.navigate(i18n.t('tab_navigator.shop'));
  };

  const _informationItem = (item: any, index: number) => {
    if (isShowMergeItems) {
      const listInventoryTem = [...listInventory];
      listInventoryTem[index].isMerge = !listInventoryTem[index].isMerge;
      setListInventory([...listInventoryTem]);

      const findByIsMerge = listInventory.filter(
        (inventory: any) => inventory.isMerge,
      );
      findByIsMerge.length >= 2
        ? setIsMergeItems(true)
        : setIsMergeItems(false);

      setListCoinMerge(findByIsMerge);

      return;
    }
    setIsInformationItemVisible(true);
    setCoin(item);
  };

  const _renderText = () => {
    return tab == 1
      ? i18n.t('inventory.content_not_item')
      : i18n.t('inventory.content_not_item_two');
  };

  const _renderItemFilter = useCallback(
    (item: any, index: number) => (
      <TouchableOpacity
        onPress={() => _chooseFilter(item)}
        style={[localStyles.wrapperItem]}>
        <Text style={[styles.text14Regular, { textAlign: 'center' }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [isLoading, i18n, listInventory],
  );

  const _renderItem = useCallback(
    (item: any, index: number) => (
      <TouchableOpacity
        onPress={() => _informationItem(item, index)}
        style={[
          localStyles.item,
          {
            borderBottomColor:
              tab == 1 && listInventory.length - 1 == index
                ? colors.backgroundContent
                : colors.transparent,
            borderBottomWidth:
              tab == 1 && listInventory.length - 1 == index ? 1 : 0,
          },
        ]}>
        <View>
          <View style={[localStyles.wrapperInfo]}>
            <View style={[localStyles.wrapperIconBitcoin]}>
              <FastImage
                source={{
                  uri: item?.product?.image_url,
                  headers: { Authorization: 'ImageBitcoin' },
                  priority: FastImage.priority.normal,
                }}
                style={[localStyles.iconBitcoin]}
                resizeMode={FastImage.resizeMode.contain}
              />
              <View
                style={[
                  localStyles.level,
                  {
                    backgroundColor:
                      tab == 2 ? colors.blue : colors.transparent,
                  },
                ]}>
                <Text
                  style={[styles.text9Bold, { textTransform: 'uppercase' }]}>
                  {tab == 2 ? `${i18n.t('inventory.items_broken')}` : ''}
                </Text>
              </View>
              {isShowMergeItems && (
                <>
                  {item?.isMerge ? (
                    <FastImage
                      source={require('../../assets/images/icon-check.png')}
                      style={localStyles.iconCheck}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ) : (
                    <FastImage
                      source={require('../../assets/images/icon-uncheck.png')}
                      style={localStyles.iconCheck}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  )}
                </>
              )}
            </View>
            <View>
              <View
                style={[
                  localStyles.wrapperInfo,
                  { width: Dimensions.get('window').width - 105 },
                ]}>
                <View style={{ marginLeft: 12 }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.text14SemiBold,
                      {
                        color: colors.text_content,
                        width: Dimensions.get('window').width - 200,
                      },
                    ]}>
                    {item?.product_inventory_name}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => _buy(item)}
                    style={[
                      localStyles.customButton,
                      localStyles.buttonBuy,
                      { width: 51, marginTop: 0, display: (Platform?.OS != 'ios' || isStatusFunctions) ? 'flex' : 'none', },
                    ]}
                    disabled={isLoading}>
                    <Text
                      style={[
                        localStyles.labelButtonBuy,
                        {
                          backgroundColor: colors.gray_700,
                          fontWeight: 'bold',
                          color: colors.white,
                          borderRadius: 5,
                          textTransform: 'uppercase',
                        },
                      ]}>
                      {`${i18n.t('shop.lv')}${item?.level}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[localStyles.wrapperInfo]}>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text
                    style={[
                      styles.text12Regular,
                      {
                        marginTop: 5,
                        color: colors.text_content_gray,
                      },
                    ]}>
                    {item?.product?.description}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 1.5 }}>
                  <Text
                    onPress={() => _handleReliability(item)}
                    style={[
                      styles.text12Bold,
                      localStyles.durability,
                      { opacity: item?.durability < 100 && (Platform?.OS != 'ios' || isStatusFunctions) ? 1 : 0 },
                    ]}>
                    {i18n.t('inventory.fix_reliability')}
                  </Text>
                  <Text
                    style={[
                      styles.text14SemiBold,
                      { marginTop: 6, color: colors.blue },
                    ]}>
                    <Text style={{ color: colors.text }}>
                      {i18n.t('inventory.reliability')} :
                    </Text>
                    <Text> {item?.durability}/100</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[localStyles.wrapperInfo]}>
            <Text
              style={[
                styles.text12Regular,
                { color: colors.blue, marginTop: 5 },
              ]}>
              {i18n.t('inventory.serial')}: {item?.serial_number_glass}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [tab, isShowMergeItems, listInventory],
  );

  const _renderMergeItem = useMemo(
    () => (
      <MergeItems
        setShowIsMergeItems={setShowIsMergeItems}
        isMergeItems={isMergeItems}
      />
    ),
    [isMergeItems, i18n],
  );

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <View style={[localStyles.container]}>
        <View
          style={[
            styles.row,
            {
              marginTop: 30,
              borderBottomColor: colors.backgroundContent,
              borderBottomWidth: 1,
              justifyContent: 'space-evenly',
              position: 'relative',
              width: Dimensions.get('window').width,
              height: 50,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setTab(1);
            }}
            style={[
              tab == 1 ? styles.button : localStyles.button,
              {
                overflow: 'hidden',
                borderBottomColor:
                  tab == 1 ? colors.pink_s : colors.transparent,
                borderBottomWidth: 3,
                borderRadius: 0,
                paddingTop: 5,
                position: 'absolute',
                right: Dimensions.get('window').width / 1.7,
                bottom: -1,
              },
            ]}>
            <Text style={[styles.text12SemiBold, localStyles.tab]}>
              {i18n.t('inventory.can_use')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTab(2);
            }}
            style={[
              tab == 2 ? styles.button : localStyles.button,
              {
                borderBottomColor:
                  tab == 2 ? colors.pink_s : colors.transparent,
                borderBottomWidth: 2,
                borderRadius: 0,
                paddingTop: 5,
                position: 'absolute',
                left: Dimensions.get('window').width / 1.7,
                marginTop: 12,
                bottom: -1,
              },
            ]}>
            <Text style={[styles.text12SemiBold, localStyles.tab]}>
              {i18n.t('inventory.can_not_use')}
            </Text>
          </TouchableOpacity>
        </View>
        {listInventory[0] && (
          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', paddingHorizontal: 16 },
            ]}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              style={[
                localStyles.menu,
                {
                  marginLeft:
                    language == 'en'
                      ? Dimensions.get('screen').width / 3 - 60
                      : 0,
                },
              ]}
              contentStyle={[localStyles.contentStyleMenu]}
              anchor={
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(true);
                  }}
                  style={[styles.row, localStyles.wrapperMenu]}>
                  <View>
                    <Text
                      style={[styles.text14Regular, { color: colors.black }]}>
                      {filterType?.name}
                    </Text>
                  </View>
                  <FastImage
                    source={require('../../assets/images/icon-dropdown.png')}
                    style={localStyles.iconDropdown}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              }>
              <FlatList
                style={[localStyles.styleFlatListFilter]}
                contentContainerStyle={[localStyles.flatListFilter]}
                data={listFilter}
                numColumns={1}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => JSON.stringify(item).toString() + index}
                renderItem={({ item, index }: any) =>
                  _renderItemFilter(item, index)
                }
                ItemSeparatorComponent={itemSeparator}
              />
            </Menu>
          </View>
        )}
        {isLoading ? (
          <ActivityIndicator
            color={colors.gold_500}
            size={'small'}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            style={[localStyles.styleFlatList]}
            contentContainerStyle={[localStyles.flatList]}
            data={listInventory}
            numColumns={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => JSON.stringify(item).toString() + index}
            renderItem={({ item, index }: any) => _renderItem(item, index)}
            ItemSeparatorComponent={itemSeparator}
            onEndReached={_handleLoadMore}
            ListEmptyComponent={
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={[
                    styles.text16Medium,
                    {
                      paddingTop: 80,
                      marginBottom: 15,
                      textAlign: 'center',
                      fontSize: 18,
                    },
                  ]}>
                  {i18n.t('inventory.not_item')}
                </Text>
                <FastImage
                  source={require('../../assets/images/image-not-item.png')}
                  style={localStyles.iconNotItem}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text
                  style={[
                    styles.text14Regular,
                    { marginVertical: 19, textAlign: 'center', lineHeight: 30 },
                  ]}>
                  {_renderText()}
                </Text>
                {tab == 1 && (
                  <Button
                    mode="contained"
                    onPress={_redirectToShop}
                    style={[
                      styles.button,
                      localStyles.buttonShop,
                      { backgroundColor: colors.btn_black },
                    ]}
                    uppercase={true}
                    labelStyle={[localStyles.labelButton]}
                    disabled={isLoading}
                    loading={isLoading}>
                    {i18n.t('inventory.shop')}
                  </Button>
                )}
              </View>
            }
          />
        )}
      </View>
      {isShowMergeItems && _renderMergeItem}
    </View>
  );
};

export default InventoryScreen;
