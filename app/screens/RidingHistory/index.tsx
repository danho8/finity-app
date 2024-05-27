import React, { useCallback, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ScrollView,
  NativeScrollEvent,
} from 'react-native';
import NavigationService from 'app/navigation/NavigationService';
import { useTheme } from 'react-native-paper';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment-timezone';
import styles from '../../styles';
import { useNavigation } from '@react-navigation/native';
import i18n from 'app/i18n';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { authActionSelector, authStateSelector } from 'app/store/index';
import { modalActionSelector } from 'app/store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { _abbreviateNumber, formatMoney } from 'app/utils/formatString';

const RidingHistoryScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [activeSections, setActiveSections] = useState([]);
  const [page, setPage] = useState(1);
  const [listHistoriesCycle, setListHistoriesCycle] = useState<any>([]);

  const { getHistoriesCycle, getHistoriesCycleDetail, setIsHistoriesCycle } =
    useStoreActions(authActionSelector);
  const { historiesCycle, user, historiesCycleDetail, isHistoriesCycle } =
    useStoreState(authStateSelector);
  const { setLoadingVisible } = useStoreActions(modalActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        containerPadding: {
          paddingHorizontal: 15,
        },
        textContent: {
          lineHeight: 30,
          color: colors.gold_500,
          marginLeft: 5,
        },
        iconDropdown: {
          width: 14,
          height: 14,
          marginTop: 10,
        },
        imgItemInventory: {
          width: 73,
          height: 73,
          borderWidth: 1,
          borderColor: colors.backgroundContent,
          backgroundColor: colors.white,
          borderRadius: 10
        }
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setLoadingVisible(true);
      setTimeout(() => {
        setLoadingVisible(false);
      }, 1);
    });
  }, [navigation]);

  useEffect(() => {
    _handleLoadMore();
  }, []);

  useEffect(() => {
    setIsHistoriesCycle(false);
    if (isHistoriesCycle) {
      setListHistoriesCycle([...listHistoriesCycle, ...historiesCycle]);
    }
  }, [isHistoriesCycle]);

  useEffect(() => {
    if (listHistoriesCycle.length == 5) {
      _handleLoadMore();
    }
  }, [listHistoriesCycle]);

  const _handleLoadMore = async () => {
    setPage(page + 1);
    await getHistoriesCycle({
      user_id: user?.user_id,
      page: page,
      paginate_size: 20,
    });
  };

  const _handleLoadHistoriesCycleDetail = async (item: any) => {
    await getHistoriesCycleDetail({
      history_id: item?.id,
    });
  };

  const _isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const _renderSectionTitle = () => {
    return <View />;
  };

  const _renderMap = (section: any) => {
    if (
      section?.address_from_json?.latitude && section?.address_from_json?.longitude &&
      section?.address_current_json?.latitude && section?.address_current_json?.longitude
    ) {
      NavigationService.navigate('MapResultScreen', {
        distance: section?.distance,
        time: section?.time,
        from: {
          latitude: section?.address_from_json?.latitude,
          longitude: section?.address_from_json?.longitude,
        },
        to: {
          latitude: section?.address_current_json?.latitude,
          longitude: section?.address_current_json?.longitude,
        },
        goal_settings: section?.goal_setting || 0,
      });
    }
  };

  const _renderHeader = (section: any, index: number, isActive: boolean) => {
    return (
      <TouchableOpacity
        onPress={() => _handleLoadHistoriesCycleDetail(section)}
        style={[
          styles.header,
          {
            marginBottom: isActive ? 0 : 10,
            borderBottomWidth: isActive ? 0 : 3,
            borderBottomLeftRadius: isActive ? 0 : 10,
            borderBottomRightRadius: isActive ? 0 : 10,
            borderRightWidth: 0,
            backgroundColor: colors.blue_300,
            paddingHorizontal: 18,
            paddingVertical: 11,
          },
        ]}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.text14Regular]}>
              {section.distance}
              {i18n.t('km')}
            </Text>
            <Text style={[styles.text14Regular, { paddingHorizontal: 5 }]}>
              /
            </Text>
            <Text style={[styles.text14Regular]}>{section.time}</Text>
            <Text style={[styles.text14Regular, { paddingHorizontal: 5 }]}>
              /
            </Text>
            <Text style={[styles.text14Regular]}>
              {section.mining}
              {i18n.t('CFT')}
            </Text>
          </View>
          <Text style={[styles.text12Regular, { color: colors.gray_300 }]}>
            {moment(section.updated_at).format('YYYY-MM-DD')}
          </Text>
        </View>
        {isActive ? (
          <FastImage
            source={require('../../assets/images/icon-arrow-top.png')}
            style={localStyles.iconDropdown}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : (
          <FastImage
            source={require('../../assets/images/icon-dropdown.png')}
            style={localStyles.iconDropdown}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
      </TouchableOpacity>
    );
  };

  const _renderContent = useCallback(
    (section: any) => {
      return (
        <View
          style={[
            styles.content,
            { paddingBottom: 31, backgroundColor: colors.blue_300 },
          ]}>
          <Text
            style={[
              localStyles.containerPadding,
              {
                color: colors.gold_500,
                marginBottom: 7,
                fontWeight: 'bold',
                lineHeight: 30,
              },
            ]}>
            {i18n.t('riding_history.information')}
          </Text>
          <View style={localStyles.containerPadding}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text14Regular, { lineHeight: 30 }]}>
                {i18n.t('riding_history.distance_traveled')} :
              </Text>
              <Text style={[styles.text14Regular, localStyles.textContent]}>
                {section.distance || 0}
                {i18n.t('km')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text14Regular, { lineHeight: 30 }]}>
                {i18n.t('riding_history.travel_time')} :
              </Text>
              <Text style={[styles.text14Regular, localStyles.textContent]}>
                {section.time || '00:00:00'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text14Regular, { lineHeight: 30 }]}>
                {i18n.t('riding_history.paid_reward')} :
              </Text>
              <Text style={[styles.text14Regular, localStyles.textContent]}>
                {Number(section.mining < 1000)
                  ? formatMoney(section.mining)
                  : _abbreviateNumber(Number(section.mining))
                } {i18n.t('CFT')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
              }}>
              <Text
                onPress={() => _renderMap(section)}
                style={[
                  styles.text14Regular,
                  localStyles.textContent,
                  { marginRight: 7 },
                ]}>
                {i18n.t('riding_history.path_check')}
              </Text>
              <TouchableOpacity onPress={() => _renderMap(section)}>
                <FastImage
                  source={require('../../assets/images/icon-check-path.png')}
                  style={{ width: 24, height: 21 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              localStyles.containerPadding,
              {
                marginTop: 21,
                borderTopWidth: 0.4,
                borderTopColor: colors.gray_200,
              },
            ]}>
            <Text
              style={[
                styles.text14Regular,
                { fontSize: 16, lineHeight: 30, marginTop: 21 },
              ]}>
              {i18n.t('riding_history.item_information')}
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <FastImage
                  source={
                    historiesCycleDetail?.product_inventory?.image_url
                      ? {
                        uri: historiesCycleDetail?.product_inventory
                          ?.image_url,
                      }
                      : require('../../assets/images/icon-bike.png')
                  }
                  style={localStyles.imgItemInventory}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.text14Regular, { width: 130 }]}>
                    {historiesCycleDetail?.product_inventory?.name}
                  </Text>
                  <Text
                    style={[styles.text12Regular, { color: colors.gray_300 }]}>
                    {historiesCycleDetail?.product_inventory?.durability}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor: colors.tab_gray,
                  width: 50,
                  height: 20,
                }}>
                <Text
                  style={
                    (styles.text12Medium,
                      { fontWeight: 'bold', color: colors.white })
                  }>
                  {i18n.t('LV')}
                  {historiesCycleDetail?.product_inventory?.level}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [historiesCycleDetail?.history_id],
  );

  const _updateSections = (activeSection: any) => {
    setActiveSections(activeSection);
  };

  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (_isCloseToBottom(nativeEvent)) {
          _handleLoadMore();
        }
      }}
      style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <Accordion
        sections={listHistoriesCycle}
        activeSections={activeSections}
        renderSectionTitle={_renderSectionTitle}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        containerStyle={{ backgroundColor: colors.white, marginTop: 13 }}
        sectionContainerStyle={{ backgroundColor: colors.white }}
        underlayColor={colors.blue_300}
      />
    </ScrollView>
  );
};

export default RidingHistoryScreen;
