import request from 'app/utils/api/baseAxios';
import {
  IAdvertisementsDetail,
  ICoinHold,
  ICoinsSwap,
  IConfirmReward,
  IConfirmSwap,
  IGoRiceCycling,
  IGoRiceEndRoad,
  IGoRiceStart,
  IHistoryDepositAndWithdraw,
  IListCommercial,
  ISettingAds,
  IUpdateWallet,
  IWithdrawalRequest,
} from '../interface/home.interface';

const commercial = (params: IListCommercial) => {
  return request({
    url: '/advertisements',
    method: 'GET',
    params,
  });
};

const advertisementsDetail = (params: IAdvertisementsDetail) => {
  return request({
    url: `/advertisements/detail/${params.id}`,
    method: 'GET',
  });
};

const reward = () => {
  return request({
    url: '/go-ride/reward',
    method: 'GET',
  });
};

const confirmReward = (data: IConfirmReward) => {
  return request({
    url: '/go-ride/confirm-reward',
    method: 'POST',
    data,
  });
};

const settingAds = (data: ISettingAds) => {
  return request({
    url: '/advertisements/setting-ad',
    method: 'POST',
    data,
  });
};

const banners = () => {
  return request({
    url: '/banners',
    method: 'GET',
  });
};

const coins = () => {
  return request({
    url: '/coins',
    method: 'GET',
  });
};

const coinsSwap = (params: ICoinsSwap) => {
  return request({
    url: '/coins/swap',
    method: 'GET',
    params,
  });
};

const confirmSwap = (data: IConfirmSwap) => {
  return request({
    url: '/coins/confirm-swap',
    method: 'POST',
    data,
  });
};

const coinHold = (params: ICoinHold) => {
  return request({
    url: `/coins/wallet/${params?.coin_id}`,
    method: 'GET',
  });
};

const informationSettingAd = () => {
  return request({
    url: '/advertisements/information-setting-ad',
    method: 'GET',
  });
};

const historyDepositAndWithdraw = (params: IHistoryDepositAndWithdraw) => {
  return request({
    url: `/wallets/history-deposit-and-withdraw/${params.id_wallet}`,
    method: 'GET',
    params,
  });
};

const withdrawalRequest = (data: IWithdrawalRequest) => {
  return request({
    url: '/wallets/withdrawal-request',
    method: 'POST',
    data,
  });
};

const updateWallet = (data: IUpdateWallet) => {
  return request({
    url: `/wallets/update-wallet/${data?.coin_id}`,
    method: 'POST',
  });
};

const bikeInformationDefault = () => {
  return request({
    url: '/go-ride/bike-information-default',
    method: 'GET',
  });
};

const historyToday = () => {
  return request({
    url: '/go-ride/history-today',
    method: 'GET',
  });
};

const goRiceStart = (data: IGoRiceStart) => {
  return request({
    url: '/go-ride/start',
    method: 'POST',
    data,
  });
};

const goRiceCycling = (data: IGoRiceCycling) => {
  return request({
    url: '/go-ride/cycling',
    method: 'POST',
    data,
  });
};

const goRiceEndRoad = (data: IGoRiceEndRoad) => {
  return request({
    url: '/go-ride/end-road',
    method: 'POST',
    data,
  });
};

const getCollectionId = () => {
  return request({
    url: '/go-ride/get-log',
    method: 'GET',
  });
};

export {
  commercial,
  advertisementsDetail,
  reward,
  confirmReward,
  settingAds,
  banners,
  coins,
  coinsSwap,
  confirmSwap,
  coinHold,
  informationSettingAd,
  historyDepositAndWithdraw,
  withdrawalRequest,
  updateWallet,
  bikeInformationDefault,
  historyToday,
  goRiceStart,
  goRiceCycling,
  goRiceEndRoad,
  getCollectionId,
};
