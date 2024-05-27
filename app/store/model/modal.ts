import { action, Action } from "easy-peasy";
export interface IModalModel {
  connectivityModal: boolean;
  setConnectivityModal: Action<IModalModel, boolean>;

  onlineOfflineModal: boolean;
  setOnlineOfflineModal: Action<IModalModel, boolean>;

  isTermsVisible: boolean;
  setIsTermsVisible: Action<IModalModel, boolean>;

  isTypeTerms: number;
  setIsTypeTerms: Action<IModalModel, number>;

  isResetPasswordSuccessVisible: boolean;
  setIsResetPasswordSuccess: Action<IModalModel, boolean>;

  isLogoutVisible: boolean;
  setIsLogoutVisible: Action<IModalModel, boolean>;

  isQueryMartVisible: boolean;
  setIsQueryMartVisible: Action<IModalModel,boolean>;

  isNotificationVisible: boolean;
  setIsNotificationVisible: Action<IModalModel, boolean>;

  isEditAccountSuccessVisible: boolean;
  setIsEditAccountSuccessVisible: Action<IModalModel, boolean>;

  isPasswordErrorVisible: boolean;
  setIsPasswordErrorVisible: Action<IModalModel, boolean>;

  isChangePasswordSuccessVisible: boolean;
  setIsChangePasswordSuccessVisible: Action<IModalModel, boolean>;

  isBuyVisible: boolean;
  setIsBugVisible: Action<IModalModel, boolean>;

  isUpgradeVisible: boolean;
  setIsUpgradeVisible: Action<IModalModel, boolean>;

  isUpgradeSuccessVisible: boolean;
  setIsUpgradeSuccessVisible: Action<IModalModel, boolean>;

  isInformationItemVisible: boolean;
  setIsInformationItemVisible: Action<IModalModel, boolean>;

  isReliabilityFeeVisible: boolean;
  setIsReliabilityFeeVisible: Action<IModalModel, boolean>;

  isReliabilityFeeSuccessVisible: boolean;
  setIsReliabilityFeeSuccessVisible: Action<IModalModel, boolean>;

  isMergeItemsVisible: boolean;
  setMergeItemsVisible: Action<IModalModel, boolean>;

  textNotification: string;
  setTextNotification: Action<IModalModel, string>;
  
  isSettingVisible:boolean;
  setIsSettingVisible: Action<IModalModel, boolean>;

  isPaymentVisible:boolean;
  setIsPaymentVisible: Action<IModalModel, boolean>;

  isSendItemToUserVisible:boolean;
  setIsSendItemToUserVisible: Action<IModalModel, boolean>;

  isSendItemToUserSuccessVisible:boolean;
  setIsSendItemToUserSuccessVisible: Action<IModalModel, boolean>;

  isLoadingVisible:boolean;
  setLoadingVisible: Action<IModalModel, boolean>;

  isBuyErrorVisible: boolean;
  setIsBuyErrorVisible: Action<IModalModel, boolean>;

  isWithdrawalSuccessVisible: boolean;
  setIsWithdrawalSuccessVisible: Action<IModalModel, boolean>;

  isEditBodyInformationVisible: boolean;
  setIsEditBodyInformationVisible: Action<IModalModel, boolean>;

  isEditBodyInformationFirstVisible: boolean;
  setIsEditBodyInformationFirstVisible: Action<IModalModel, boolean>;

  isChooseLocationVisible: boolean;
  setIsChooseLocationVisible: Action<IModalModel, boolean>;

  isStopMiningVisible: boolean;
  setIsStopMiningVisible: Action<IModalModel, boolean>;

  isEndOfRideVisible: boolean;
  setIsEndOfRideVisible: Action<IModalModel, boolean>;

  isChangeItemVisible: boolean;
  setIsChangeItemVisible: Action<IModalModel, boolean>;

  isItemPurchaseGuideModel: boolean;
  setIsItemPurchaseGuideModel: Action<IModalModel, boolean>;

  isNearDestination: boolean;
  setIsNearDestination: Action<IModalModel, boolean>;
}

export const modalModel: IModalModel = {
  connectivityModal: false,
  setConnectivityModal: action((state, payload) => {
    state.connectivityModal = payload;
  }),

  onlineOfflineModal: false,
  setOnlineOfflineModal: action((state, payload) => {
    state.onlineOfflineModal = payload;
  }),

  isResetPasswordSuccessVisible: false,
  setIsResetPasswordSuccess: action((state, payload) => {
    state.isResetPasswordSuccessVisible = payload;
  }),

  isTermsVisible: false,
  setIsTermsVisible: action((state, payload) => {
    state.isTermsVisible = payload;
  }),

  isTypeTerms: 1,
  setIsTypeTerms: action((state, payload) => {
    state.isTypeTerms = payload;
  }),

  isNotificationVisible: false,
  setIsNotificationVisible: action((state, payload) => {
    state.isNotificationVisible = payload;
  }),

  isLogoutVisible: false,
  setIsLogoutVisible: action((state, payload) => {
    state.isLogoutVisible = payload;
  }),

  isQueryMartVisible: false,
  setIsQueryMartVisible: action((state, payload) => {
    state.isQueryMartVisible = payload;
  }),

  isEditAccountSuccessVisible: false,
  setIsEditAccountSuccessVisible: action((state, payload) => {
    state.isEditAccountSuccessVisible = payload;
  }),

  isPasswordErrorVisible: false,
  setIsPasswordErrorVisible: action((state, payload) => {
    state.isPasswordErrorVisible = payload;
  }),

  isChangePasswordSuccessVisible: false,
  setIsChangePasswordSuccessVisible: action((state, payload) => {
    state.isChangePasswordSuccessVisible = payload;
  }),

  isBuyVisible: false,
  setIsBugVisible: action((state, payload) => {
    state.isBuyVisible = payload;
  }),

  isUpgradeVisible: false,
  setIsUpgradeVisible: action((state, payload) => {
    state.isUpgradeVisible = payload;
  }),

  isUpgradeSuccessVisible: false,
  setIsUpgradeSuccessVisible: action((state, payload) => {
    state.isUpgradeSuccessVisible = payload;
  }),

  isInformationItemVisible: false,
  setIsInformationItemVisible: action((state, payload) => {
    state.isInformationItemVisible = payload;
  }),

  isReliabilityFeeVisible: false,
  setIsReliabilityFeeVisible: action((state, payload) => {
    state.isReliabilityFeeVisible = payload;
  }),

  isReliabilityFeeSuccessVisible: false,
  setIsReliabilityFeeSuccessVisible: action((state, payload) => {
    state.isReliabilityFeeSuccessVisible = payload;
  }),

  isMergeItemsVisible: false,
  setMergeItemsVisible: action((state, payload) => {
    state.isMergeItemsVisible = payload;
  }),

  textNotification: '',
  setTextNotification: action((state, payload) => {
    state.textNotification = payload;
  }),

  isSettingVisible: false,
  setIsSettingVisible: action((state, payload) => {
    state.isSettingVisible = payload;
  }),

  isPaymentVisible: false,
  setIsPaymentVisible: action((state, payload) => {
    state.isPaymentVisible = payload;
  }),

  isSendItemToUserVisible: false,
  setIsSendItemToUserVisible: action((state, payload) => {
    state.isSendItemToUserVisible = payload;
  }),

  isSendItemToUserSuccessVisible: false,
  setIsSendItemToUserSuccessVisible: action((state, payload) => {
    state.isSendItemToUserSuccessVisible = payload;
  }),

  isLoadingVisible: false,
  setLoadingVisible: action((state, payload) => {
    state.isLoadingVisible = payload;
  }),

  isBuyErrorVisible: false,
  setIsBuyErrorVisible: action((state, payload) => {
    state.isBuyErrorVisible = payload;
  }),

  isWithdrawalSuccessVisible: false,
  setIsWithdrawalSuccessVisible: action((state, payload) => {
    state.isWithdrawalSuccessVisible = payload;
  }),

  isEditBodyInformationVisible: false,
  setIsEditBodyInformationVisible: action((state, payload) => {
    state.isEditBodyInformationVisible = payload;
  }),

  isEditBodyInformationFirstVisible: false,
  setIsEditBodyInformationFirstVisible: action((state, payload) => {
    state.isEditBodyInformationFirstVisible = payload;
  }),

  isChooseLocationVisible: false,
  setIsChooseLocationVisible: action((state, payload) => {
    state.isChooseLocationVisible = payload;
  }),

  isStopMiningVisible: false,
  setIsStopMiningVisible: action((state, payload) => {
    state.isStopMiningVisible = payload;
  }),

  isEndOfRideVisible: false,
  setIsEndOfRideVisible: action((state, payload) => {
    state.isEndOfRideVisible = payload;
  }),

  isChangeItemVisible: false,
  setIsChangeItemVisible: action((state, payload) => {
    state.isChangeItemVisible = payload;
  }),

  isItemPurchaseGuideModel: false,
  setIsItemPurchaseGuideModel: action((state, payload) => {
    state.isItemPurchaseGuideModel = payload;
  }),

  isNearDestination: false,
  setIsNearDestination: action((state, payload) => {
    state.isNearDestination = payload;
  }),
};
