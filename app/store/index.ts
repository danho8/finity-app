import {
  createStore,
  createTypedHooks,
  StateMapper,
  ActionMapper,
} from "easy-peasy";

import { authModel as auth, IAuthModel } from "./model/auth";
import { modalModel as modal, IModalModel } from "./model/modal";
import { shopModel as shop, IShopModel } from "./model/shop";
import { noticeModel as notice, INoticeModel } from "./model/notice";
import { homeModel as home, IHomeModel } from './model/home';
import { settingModel as setting, ISettingModel } from './model/setting';
export interface StoreModel {
  auth: IAuthModel;
  modal: IModalModel;
  shop: IShopModel;
  notice: INoticeModel;
  home: IHomeModel;
  setting: ISettingModel;
}

const storeModel = { auth, modal, shop, notice , home, setting};

export const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
  createTypedHooks<StoreModel>();

interface IStateMapper extends StateMapper<StoreModel> { }
interface IActionMapper extends ActionMapper<StoreModel, keyof StoreModel> { }

// Auth
export const authStateSelector = (state: IStateMapper) => state.auth;
export const authActionSelector = (state: IActionMapper) => state.auth;

// Modal
export const modalStateSelector = (state: IStateMapper) => state.modal;
export const modalActionSelector = (state: IActionMapper) => state.modal;

// Shop
export const shopStateSelector = (state: IStateMapper) => state.shop;
export const shopActionSelector = (state: IActionMapper) => state.shop;

// Notice
export const noticeStateSelector = (state: IStateMapper) => state.notice;
export const noticeActionSelector = (state: IActionMapper) => state.notice;

// Home
export const homeStateSelector = (state: IStateMapper) => state.home;
export const homeActionSelector = (state: IActionMapper) => state.home;

// Setting
export const settingStateSelector = (state: IStateMapper) => state.setting;
export const settingActionSelector = (state: IActionMapper) => state.setting;

const store = createStore(storeModel, {
  name: "store",
  // middleware,
});
export default store;
