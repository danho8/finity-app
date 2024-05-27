import i18n from 'app/i18n';
import {
  modalActionSelector,
  modalStateSelector,
  shopActionSelector,
  shopStateSelector,
  homeStateSelector,
} from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Button, Dialog, useTheme } from 'react-native-paper';

const ChangeItemModel: React.FC = () => {
  const { colors }: any = useTheme();

  const [page, setPage] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setIsChangeItemVisible } = useStoreActions(modalActionSelector);
  const { isChangeItemVisible } = useStoreState(modalStateSelector);
  const { settingBike, setIsSettingBike, productInventory } =
    useStoreActions(shopActionSelector);
  const { listInventory, isSettingBike } = useStoreState(shopStateSelector);
  const { dataGoRiceStart } = useStoreState(homeStateSelector);

  const [idInventory, setIdInventory] = useState(null);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          backgroundColor: colors.background,
          height: 400,
        },
        textContent: {
          lineHeight: 22,
        },
        title: {
          marginBottom: 23,
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 16,
          right: 12,
          zIndex: 1,
        },
        iconClose: {
          width: 18,
          height: 18,
        },
        button: {
          width: (Dimensions.get('screen').width - 140) / 2,
          borderRadius: 10,
          marginTop: 17,
          marginBottom: 13,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: Platform.OS == 'ios' ? 10.5 : 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
        flatListContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 19,
          paddingVertical: 11,
          justifyContent: 'space-between',
          borderBottomWidth: 0.4,
          borderBottomColor: colors.text_content_gray,
        },
        imageItem: {
          width: 73,
          height: 73,
          marginRight: 10,
          borderRadius: 10,
        },
        itemStatus: {
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 20,
          backgroundColor: colors.gray_300,
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
    setIdInventory(dataGoRiceStart?.product_inventory_id);
  }, [dataGoRiceStart]);

  useEffect(() => {
    setIsSettingBike(false);
    if (isSettingBike) {
      setIsChangeItemVisible(false);
    }
  }, [isSettingBike]);

  const _cancel = async () => {
    setIsChangeItemVisible(false);
  };

  const _chooseItem = (item: any) => {
    setIdInventory(item?.id);
  };

  const _submit = async () => {
    await settingBike({
      product_inventory_id: idInventory,
    });
  };

  const _renderItem = useCallback(
    (item: any, index: number) => (
      <TouchableOpacity
        onPress={() => _chooseItem(item)}
        style={[
          localStyles.flatListContainer,
          {
            backgroundColor:
              idInventory && idInventory == item?.id
                ? colors.accent
                : colors.white,
          },
        ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FastImage
            source={{ uri: item?.product?.image_url }}
            resizeMode={FastImage.resizeMode.contain}
            style={localStyles.imageItem}
          />
          <View style={{ width: '60%' }}>
            <Text
              style={[
                styles.text14Regular,
                { color: colors.btn_black, width: 150 },
              ]}>
              {item?.product_inventory_name}
            </Text>
            <Text
              style={[
                styles.text12Regular,
                { color: colors.text_content_gray },
              ]}>
              {item?.product?.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [listInventory, idInventory],
  );

  const _handleRefresh = async () => {
    setPage(page + 10);
    await productInventory({
      can_use: 1,
      paginate_size: 10,
    });
    setIsRefreshing(false);
  };

  const _handleLoadMore = async () => {
    setPage(page + 10);
    await productInventory({
      can_use: 1,
      paginate_size: page,
    });
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
    [listInventory],
  );

  return (
    <Dialog
      visible={isChangeItemVisible}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}>
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
        {i18n.t('go_rice.change_item')}
      </Text>
      <FlatList
        data={listInventory}
        numColumns={1}
        renderItem={({ item, index }: any) => _renderItem(item, index)}
        keyExtractor={(item, index) => JSON.stringify(item).toString() + index}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
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
      <View style={{ alignItems: 'center' }}>
        <Button
          mode="contained"
          onPress={_submit}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.btn_black },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('go_rice.change_confirm')}
        </Button>
      </View>
    </Dialog>
  );
};

export default ChangeItemModel;
