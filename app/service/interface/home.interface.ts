import {IRegion} from './map.interface';

export interface IListCommercial {
  paginate_size: number;
}

export interface IAdvertisementsDetail {
  id: string;
}

export interface IConfirmReward {
  receive: number;
}

export interface ISettingAds {
  time: number;
  product_inventory_id: string;
}

export interface ICoinsSwap {
  amount: number;
  coin_exchange: number;
  coin_receive: number;
}

export interface IConfirmSwap {
  amount: number;
  coin_exchange: number;
  coin_receive: number;
  swap: enumSwap;
}

export enum enumSwap {
  can = 1,
  not_can = 0,
}

export interface ICoinHold {
  coin_id: number;
}

export interface IHistoryDepositAndWithdraw {
  id_wallet: number;
  status?: enumStatus;
  page: number;
}

export enum enumStatus {
  all = '',
  deposit = 0,
  withdrawal = 1,
}

export interface IWithdrawalRequest {
  address: string;
  coin_id: string;
  amount: string;
}

export interface IUpdateWallet {
  coin_id: number;
}

export interface IGoRiceStart {
  product_inventory_id: number;
  goal_setting: number;
  latitude: number;
  longitude: number;
  address_from: IRegion | any;
}

export interface IGoRiceCycling {
  distance: number;
  latitude: number;
  longitude: number;
  average_speed: number;
}

export interface IGoRiceEndRoad {
  goal: number;
}
