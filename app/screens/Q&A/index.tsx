/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Accordion from 'react-native-collapsible/Accordion';
import FastImage from 'react-native-fast-image';
import styles from '../../styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { noticeActionSelector, noticeStateSelector } from 'app/store';
import { useNavigation } from '@react-navigation/native';

const QAndAScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSections, setActiveSections] = useState([]);
  const { listQAndA } = useStoreState(noticeStateSelector);
  const { getListQAndA } = useStoreActions(noticeActionSelector);
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
          width: 16,
          height: 16,
          marginTop: 8,
          marginRight: 12,
        },
        content: {
          width: 40,
          height: 40,
        },
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
    setPage(page + 20);
    await getListQAndA({
      paginate_size: page + 20,
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
            marginBottom: isActive ? 0 : 8,
            borderBottomWidth: isActive ? 0 : 3,
            borderBottomLeftRadius: isActive ? 0 : 10,
            borderBottomRightRadius: isActive ? 0 : 10,
            borderRightWidth: isActive ? 0 : 1,
            backgroundColor: colors.accent,
            paddingTop: isActive ? 9 : 10,
            paddingBottom: isActive ? 0 : 10,
          },
        ]}>
        <FastImage
          source={require('../../assets/images/img-Q&A.png')}
          style={localStyles.content}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View>
          <Text
            style={[
              styles.text14,

              {
                marginTop: 12,
                fontStyle: 'normal',
                color: colors.black,
                width: Dimensions.get('screen').width - 150,
              },
            ]}>
            {section.name}
          </Text>
        </View>
        {isActive ? (
          <FastImage
            source={require('../../assets/images/icon-up-size-48.png')}
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
      </View>
    );
  };
  const _renderContent = (section: any, index: number, isActive: boolean) => {
    return (
      <View
        style={[
          styles.content,
          {
            paddingVertical: 0,
            backgroundColor: colors.accent,
            paddingHorizontal: 18,
            paddingBottom: 11,
          },
        ]}>
        <Text
          style={[
            styles.text14Regular,
            { color: colors.black, lineHeight: 30 },
          ]}>
          {section.description
            .replace(/<(.|\n)*?>/g, '')
            .replace(/&nbsp;/g, '')}
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
      <Accordion
        sections={listQAndA}
        activeSections={activeSections}
        renderSectionTitle={_renderSectionTitle}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        containerStyle={{ backgroundColor: colors.white, marginTop: 13 }}
        sectionContainerStyle={{ backgroundColor: colors.white }}
        underlayColor={colors.accent}
      />
    </ScrollView>
  );
};

export default QAndAScreen;
