import { action, Action } from "easy-peasy";
export interface ISettingModel {
  language: string;
  setLanguage: Action<ISettingModel, string>;

  notification: boolean;
  setNotification: Action<ISettingModel, boolean>;

  notificationAds: boolean;
  setNotificationAds: Action<ISettingModel, boolean>;
}

export const settingModel: ISettingModel = {
  language: 'kr',
  setLanguage: action((state, payload) => {
    state.language = payload;
  }),

  notification: false,
  setNotification: action((state, payload) => {
    state.notification = payload;
  }),

  notificationAds: false,
  setNotificationAds: action((state, payload) => {
    state.notificationAds = payload;
  }),
};
