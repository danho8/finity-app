/**
 * React Native App
 * Everything starts from the Entry-point
 */
import React, {useEffect} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  useStoreRehydrated,
  StoreProvider,
  useStoreState,
  useStoreActions,
} from 'easy-peasy';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import firebase from '@react-native-firebase/messaging';

import {
  PaperThemeDefault,
  PaperThemeDark,
  CombinedDefaultTheme,
  CombinedDarkTheme,
} from 'app/config/theme-config';
import Navigator from 'app/navigation';
import store, {
  authActionSelector,
  modalActionSelector,
  modalStateSelector,
  noticeActionSelector,
} from './store';
import SplashScreen from './screens/Splash';
import NotificationNormal from './components/NotificationNormal';
import TermsModel from './screens/TermsOfService/Views/termsModel';
import ResetPasswordSuccessModel from './screens/ResetPassword/Views/resetPasswordSuccessModel';
import LogoutModel from './screens/Profile/Views/logoutModel';
import EditAccountSuccessModel from './screens/EditProfile/Views/editAccountSuccessModel';
import PasswordErrorModel from './screens/ExitMember/Views/passwordErrorModel';
import BuyModel from './screens/Shop/Views/buyModel';
import UpgradeModel from './screens/Shop/Views/upgradeModel';
import UpgradeSuccessModel from './screens/Shop/Views/upgradeSuccessModel';
import InformationItemModel from './screens/Inventory/Views/informationItemModel';
import ReliabilityFeeModel from './screens/Inventory/Views/reliabilityFeeModel';
import ReliabilityFeeSuccessModel from './screens/Inventory/Views/reliabilityFeeSuccessModel';
import ItemDamageGuideModel from './screens/GoRice/Views/itemDamageGuideModel';
import PaymentCoin from './screens/GoRice/Views/paymentCoin';
import MergeItemModel from './screens/Inventory/Views/mergeItemModel';

import LoadingModel from './components/LoadingModel';
import SendItemSuccessModel from './screens/Inventory/Views/sendItemSuccessModel';
import BuyErrorModel from './screens/Shop/Views/buyErrorModel';
import WithdrawalSuccessModel from './screens/PolygonCoin/Views/withdrawalSuccessModel';
import EditBodyInformationSuccessModel from './screens/EditBodyInformation/Views/editBodyInformationSuccessModel';
import {ChooseLocationModel} from './screens/GoRice/Views/chooseLocationModel';
import StopMiningModel from './screens/Map/Views/stopMiningModel';
import EndOfRideModel from './screens/Map/Views/endOfRideModel';
import NearDestination from './screens/Map/Views/nearDestination';
import ChangeItemModel from './screens/GoRice/Views/changeItemModel';
import ItemPurchaseGuideModel from './screens/GoRice/Views/itemPurchaseGuideModel';
import QuerymartModel from './screens/PolygonCoin/Views/querymartModel';
import FCMService from './utils/FCMService';
import {requestPermissions, LOCATION_PERMISSION} from './utils/checkPermission';
import * as Sentry from '@sentry/react-native';
import PushNotification from 'react-native-push-notification';
import NetInfo from "@react-native-community/netinfo";
import { ConnectivityModal } from './components/ConnectivityModal';

Sentry.init({
  dsn: 'https://da7432c157a3467c8dba31a2e16b9ee3@o1196460.ingest.sentry.io/4504965913378816',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

// Geolocation.setRNConfiguration({
//   skipPermissionRequests: false,
//   authorizationLevel: 'auto',
//   locationProvider: 'auto',
// });

const RootNavigation: React.FC = () => {
  const rehydrated = useStoreRehydrated();

  const {setIsRedirectNotice} = useStoreActions(noticeActionSelector);
  const {
    isNotificationVisible,
    isTermsVisible,
    isResetPasswordSuccessVisible,
    isLogoutVisible,
    isQueryMartVisible,
    isEditAccountSuccessVisible,
    isPasswordErrorVisible,
    isChangePasswordSuccessVisible,
    isBuyVisible,
    isUpgradeVisible,
    isUpgradeSuccessVisible,
    isInformationItemVisible,
    isReliabilityFeeVisible,
    isReliabilityFeeSuccessVisible,
    isSettingVisible,
    isPaymentVisible,
    isMergeItemsVisible,
    isLoadingVisible,
    isSendItemToUserSuccessVisible,
    isBuyErrorVisible,
    isWithdrawalSuccessVisible,
    isEditBodyInformationVisible,
    isEditBodyInformationFirstVisible,
    isChooseLocationVisible,
    isStopMiningVisible,
    isEndOfRideVisible,
    isChangeItemVisible,
    isItemPurchaseGuideModel,
    connectivityModal,
    isNearDestination,
  } = useStoreState(modalStateSelector);
  const { setConnectivityModal } = useStoreActions(modalActionSelector);
  const {setFcmToken} = useStoreActions(authActionSelector);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnectivityModal(!state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    _handleNotification();

    requestPermissions(LOCATION_PERMISSION || []);
  }, []);

  const isDark = false;
  const paperTheme = isDark ? PaperThemeDark : PaperThemeDefault;
  const combinedTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const _handleNotification = async () => {
    try {
      const messaging = firebase();

      messaging
        .hasPermission()
        .then(enabled => {
          if (enabled) {
            messaging
              .getToken()
              .then(token => {
                console.log(token);
                setFcmToken(token);
              })
              .catch(error => {
                /* handle error */
              });
          } else {
            messaging
              .requestPermission()
              .then(() => {
                /* got permission */
              })
              .catch(error => {
                /* handle error */
              });
          }
        })
        .catch(error => {
          /* handle error */
        });
      //kill app or background
      FCMService.initPushNotifications(notification => {
        const {userInteraction} = notification;
        if (userInteraction) {
          setIsRedirectNotice(true);
          console.log('notification when kill app', notification);

          return;
        }
      });

      // open-app
      FCMService.onMessage(item => {
        try {
          const {notification, data} = item;
          const {title, body} = notification;
          const dataNotificaton = {
            title: notification.title,
            body: notification.body,
            data,
          };
          console.log('notification when open app', dataNotificaton);
          PushNotification.localNotification({
            channelId: 'default',
            title: title,
            message: body, // (required)
          });
        } catch (error) {}
      });
    } catch (error) {
      console.log('notification error: ', error);
    }
  };

  return rehydrated ? (
    <PaperProvider theme={paperTheme}>
      <Navigator theme={combinedTheme} />
      {isNotificationVisible && <NotificationNormal />}
      {isTermsVisible && <TermsModel />}
      {(isResetPasswordSuccessVisible || isChangePasswordSuccessVisible) && (
        <ResetPasswordSuccessModel />
      )}
      {isLogoutVisible && <LogoutModel />}
      {isQueryMartVisible && <QuerymartModel />}
      {isEditAccountSuccessVisible && <EditAccountSuccessModel />}
      {isPasswordErrorVisible && <PasswordErrorModel />}
      {isBuyVisible && <BuyModel />}
      {isUpgradeVisible && <UpgradeModel />}
      {isUpgradeSuccessVisible && <UpgradeSuccessModel />}
      {isInformationItemVisible && <InformationItemModel />}
      {isReliabilityFeeVisible && <ReliabilityFeeModel />}
      {isReliabilityFeeSuccessVisible && <ReliabilityFeeSuccessModel />}
      {isSettingVisible && <ItemDamageGuideModel />}
      {isPaymentVisible && <PaymentCoin />}
      {isMergeItemsVisible && <MergeItemModel />}
      {isLoadingVisible && <LoadingModel />}
      {isSendItemToUserSuccessVisible && <SendItemSuccessModel />}
      {isBuyErrorVisible && <BuyErrorModel />}
      {isWithdrawalSuccessVisible && <WithdrawalSuccessModel />}
      {(isEditBodyInformationVisible || isEditBodyInformationFirstVisible) && <EditBodyInformationSuccessModel />}
      {isChooseLocationVisible && <ChooseLocationModel />}
      {isStopMiningVisible && <StopMiningModel />}
      {isEndOfRideVisible && <EndOfRideModel />}
      {isChangeItemVisible && <ChangeItemModel />}
      {isItemPurchaseGuideModel && <ItemPurchaseGuideModel />}
      {connectivityModal && <ConnectivityModal />}
      {isNearDestination && <NearDestination />}
    </PaperProvider>
  ) : (
    <SplashScreen />
  );
};

const EntryPoint: React.FC = () => {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
    </StoreProvider>
  );
};

export default Sentry.wrap(EntryPoint);
