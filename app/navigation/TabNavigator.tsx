import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopNavigator from './ShopNavigator';
import { useTheme } from 'react-native-paper';
import GoRiceNavigator from './GoRiceNavigator';
import MyPageNavigator from './InventoryNavigator';
import i18n from '../i18n';
import { useStoreState } from 'easy-peasy';
import { authStateSelector } from '../store';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors }: any = useTheme();

  const { isCheckMyPage } = useStoreState(authStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        style: {
          backgroundColor: colors.backgroundtabar,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
        },

        labelStyle: {
          fontSize: 14,
          fontWeight: '600',
          lineHeight: 16.8,
          textAlign: 'center',
        },
        tabStyle: {
          alignSelf: 'center',
          marginVertical: 4,
        },
        wrapperIcon: {
          alignSelf: 'center',
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
        },
        iconTab: {
          width: 24,
          height: 24,
        },
      }),
    [],
  );

  return (
    <Tab.Navigator
      initialRouteName={i18n.t('tab_navigator.go-rice')}
      screenOptions={{
        tabBarStyle: localStyles.style,
        tabBarLabelStyle: localStyles.labelStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.white,
        tabBarActiveBackgroundColor: colors.backgroundtabar,
        tabBarInactiveBackgroundColor: colors.backgroundtabar,
      }}>
      <Tab.Screen
        name={i18n.t('tab_navigator.shop')}
        component={ShopNavigator}
        options={{
          headerShown: false,
          tabBarLabel: i18n.t('tab_navigator.shop'),
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View>
                <View style={localStyles.wrapperIcon}>
                  <Image
                    source={
                      focused && !isCheckMyPage
                        ? require('../assets/images/icon-shop-active.png')
                        : require('../assets/images/icon-shop.png')
                    }
                    style={localStyles.iconTab}
                    resizeMode="cover"
                  />
                </View>
                <View style={localStyles.tabStyle}>
                  <Text
                    style={[
                      localStyles.labelStyle,
                      { color: focused && !isCheckMyPage ? colors.blue : colors.btn_black },
                    ]}>
                    {i18n.t('tab_navigator.shop')}
                  </Text>
                </View>
              </View>
            );
          },
        }}
        listeners={{}}
      />
      <Tab.Screen
        name={i18n.t('tab_navigator.go-rice')}
        component={GoRiceNavigator}
        options={{
          headerShown: false,
          tabBarLabel: i18n.t('tab_navigator.go-rice'),
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View>
                <View style={localStyles.wrapperIcon}>
                  <Image
                    source={
                      focused && !isCheckMyPage
                        ? require('../assets/images/icon-go-rice-active.png')
                        : require('../assets/images/icon-go-rice.png')
                    }
                    style={[localStyles.iconTab, { width: 52.22 }]}
                    resizeMode="contain"
                  />
                </View>
                <View style={localStyles.tabStyle}>
                  <Text
                    style={[
                      localStyles.labelStyle,
                      { color: focused && !isCheckMyPage ? colors.blue : colors.btn_black },
                    ]}>
                    {i18n.t('tab_navigator.go-rice')}
                  </Text>
                </View>
              </View>
            );
          },
        }}
        listeners={{}}
      />
      <Tab.Screen
        name={i18n.t('tab_navigator.inventory')}
        component={MyPageNavigator}
        options={{
          headerShown: false,
          tabBarLabel: i18n.t('tab_navigator.inventory'),
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View>
                <View style={localStyles.wrapperIcon}>
                  <Image
                    source={
                      focused && !isCheckMyPage
                        ? require('../assets/images/icon-inventory-active.png')
                        : require('../assets/images/icon-inventory.png')
                    }
                    style={localStyles.iconTab}
                    resizeMode="cover"
                  />
                </View>
                <View style={localStyles.tabStyle}>
                  <Text
                    style={[
                      localStyles.labelStyle,
                      { color: focused && !isCheckMyPage ? colors.blue : colors.btn_black },
                    ]}>
                    {i18n.t('tab_navigator.inventory')}
                  </Text>
                </View>
              </View>
            );
          },
        }}
        listeners={{}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
