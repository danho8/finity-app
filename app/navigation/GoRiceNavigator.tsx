import React, { useLayoutEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useStoreState } from 'easy-peasy';
import { authStateSelector } from '../store';

import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import TermsOfServiceScreen from 'app/screens/TermsOfService';
import BackBar from 'app/components/BackBar';
import RegisterScreen from 'app/screens/Register';
import RegisterSuccessScreen from 'app/screens/RegisterSuccess';
import QueryAccountInformationScreen from 'app/screens/QueryAccountInformation';
import ResultSearchIdScreen from 'app/screens/ResultSearchId';
import ResetPasswordScreen from 'app/screens/ResetPassword';
import ProfileScreen from 'app/screens/Profile';
import ProfileBar from 'app/components/ProfileBar';
import EditProfileScreen from 'app/screens/EditProfile';
import ExitMemberScreen from 'app/screens/ExitMember';
import ExitMemberSuccess from 'app/screens/ExitMemberSuccess';
import NotificationScreen from 'app/screens/Notification';
import QAndAScreen from 'app/screens/Q&A';
import SettingScreen from 'app/screens/Setting';
import WhiteBar from 'app/components/WhiteBar';
import HomeBar from 'app/components/HomeBar';
import BuyItemSuccessScreen from 'app/screens/BuyItemSuccess';
import InventoryScreen from 'app/screens/Inventory';
import CoinSituationScreen from 'app/screens/CoinSituation';
import PolygonCoinScreen from 'app/screens/PolygonCoin';
import CoinStatusBar from 'app/components/CoinStatusBar';
import SwapScreen from 'app/screens/Swap';
import QRCodeScreen from 'app/screens/QRCode';
import EditBodyInformationScreen from 'app/screens/EditBodyInformation';
import RidingHistoryScreen from 'app/screens/RidingHistory';
import GoRiceScreen from 'app/screens/GoRice';
import ShopScreen from 'app/screens/Shop';
import MapScreen from 'app/screens/Map';
import MapResultScreen from 'app/screens/MapResult';

import { useGeolocation } from './common/useGeolocation';

const Stack = createStackNavigator();
const GoRiceStack = createStackNavigator();

const GoRiceNavigator = ({ navigation, route }: any) => {
  useGeolocation();
  const { colors }: any = useTheme();

  const { token } = useStoreState(authStateSelector);

  const [animationTypeForReplace, setAnimationTypeForReplace] = React.useState<
    'pop' | 'push' | undefined
  >('push');

  React.useEffect(() => {
    token
      ? setAnimationTypeForReplace('push')
      : setAnimationTypeForReplace('pop');
  }, [token]);

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (
      routeName &&
      routeName !== 'GoRiceScreen' &&
      routeName !== 'ShopScreen' &&
      routeName !== 'InventoryScreen'
    ) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: colors.backgroundtabar,
          height: Platform.OS === 'ios' ? 90 : 65,
        },
      });
    }
  }, [navigation, route]);

  return (
    <GoRiceStack.Navigator initialRouteName="GoRiceScreen" headerMode="screen">
      <Stack.Screen
        name="GoRiceScreen"
        component={GoRiceScreen}
        options={{
          animationTypeForReplace,
          header: props => <HomeBar />,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ShopScreen"
        component={ShopScreen}
        options={{
          animationTypeForReplace,
          header: props => <HomeBar />,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="RidingHistoryScreen"
        component={RidingHistoryScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="TermsOfServiceScreen"
        component={TermsOfServiceScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="RegisterSuccessScreen"
        component={RegisterSuccessScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="QueryAccountInformationScreen"
        component={QueryAccountInformationScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ResultSearchIdScreen"
        component={ResultSearchIdScreen}
        options={{
          animationTypeForReplace,
          header: props => <WhiteBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          animationTypeForReplace,
          header: props => <ProfileBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="EditBodyInformationScreen"
        component={EditBodyInformationScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ExitMemberScreen"
        component={ExitMemberScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ExitMemberSuccess"
        component={ExitMemberSuccess}
        options={{
          animationTypeForReplace,
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="QAndAScreen"
        component={QAndAScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="BuyItemSuccessScreen"
        component={BuyItemSuccessScreen}
        options={{
          animationTypeForReplace,
          header: props => <HomeBar />,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="InventoryScreen"
        component={InventoryScreen}
        options={{
          animationTypeForReplace,
          header: props => <HomeBar />,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="CoinSituationScreen"
        component={CoinSituationScreen}
        options={{
          animationTypeForReplace,
          header: props => <CoinStatusBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="PolygonCoinScreen"
        component={PolygonCoinScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="SwapScreen"
        component={SwapScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        options={{
          animationTypeForReplace,
          header: props => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          animationTypeForReplace,
          header: props => <HomeBar />,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="MapResultScreen"
        component={MapResultScreen}
        options={{
          animationTypeForReplace,
          header: props => <HomeBar />,
          gestureEnabled: false,
        }}
      />
    </GoRiceStack.Navigator>
  );
};

export default GoRiceNavigator;
