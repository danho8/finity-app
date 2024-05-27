import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Image,
  ScrollView,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment-timezone';
import styles from '../../styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { noticeActionSelector, noticeStateSelector } from 'app/store';
import { useNavigation } from '@react-navigation/native';
import i18next from 'i18next';

const NotificationScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [activeSections, setActiveSections] = useState([]);
  const { listNotice } = useStoreState(noticeStateSelector);
  const { getListNotice } = useStoreActions(noticeActionSelector);
  const [page, setPage] = useState(0);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        iconDropdown: {
          width: 14,
          height: 14,
          marginTop: 10,
          marginRight: 10,
        },
        no_data: {
          textAlign: 'center',
          paddingTop: '50%'
        }
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      });
    });
  }, [navigation]);

  useEffect(() => {
    _handleLoadMore();
  }, []);

  const _handleLoadMore = async () => {
    setPage(page + 10);
    await getListNotice({
      paginate_size: page + 10,
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

  const _renderSectionTitle = (section: any) => {
    return <View />;
  };

  const _renderHeader = (section: any, index: number, isActive: boolean) => {
    return (
      <View
        style={[
          styles.header,
          {
            marginBottom: isActive ? 0 : 10,
            borderBottomWidth: isActive ? 0 : 3,
            borderBottomLeftRadius: isActive ? 0 : 10,
            borderBottomRightRadius: isActive ? 0 : 10,
            borderRightWidth: isActive ? 0 : 1,
            backgroundColor: colors.accent,
            paddingVertical: isActive ? 8 : 10,
          },
        ]}>
        <View>
          <Text
            style={[
              styles.text14SemiBold,
              {
                marginBottom: 5,
                fontStyle: 'normal',
                color: colors.black,
                width: Dimensions.get('screen').width - 100,
              },
            ]}>
            {section.title}
          </Text>
          <Text style={[styles.text12Regular, { color: colors.hint }]}>
            {moment(section.updated_at).format('YYYY-MM-DD')}
          </Text>
        </View>
        {isActive ? (
          <Image
            source={require('../../assets/images/icon-arrow-top.png')}
            style={localStyles.iconDropdown}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../assets/images/icon-dropdown.png')}
            style={localStyles.iconDropdown}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  const _renderContent = (section: any, index: number, isActive: boolean) => {
    return (
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.accent,
            paddingHorizontal: 11,
            marginTop: -10,
          },
        ]}>
        <Text
          style={[
            styles.text14Regular,
            { color: colors.black, lineHeight: 30 },
          ]}>
          {section.content.replace(/<(.|\n)*?>/g, '').replace(/&nbsp;/g, '')}
        </Text>
      </View>
    );
  };

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
        animated={!isLoading}
        backgroundColor={colors.splash}
      />
      {listNotice[0] ?
        <Accordion
          sections={listNotice}
          activeSections={activeSections}
          renderSectionTitle={_renderSectionTitle}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
          containerStyle={{ backgroundColor: colors.accent, marginTop: 13 }}
          sectionContainerStyle={{ backgroundColor: colors.white }}
          underlayColor={colors.accent}
        />
        : <View>
          <Text style={localStyles.no_data}>
            {`${i18next.t('notification.no_data')}`}
          </Text>
        </View>
      }
    </ScrollView>
  );
};

export default NotificationScreen;
