import {
  listNotice,
  listQAndA,
  listCycleHistory,
} from 'app/service/api/notification.service';
import {
  IListNotice,
  IListHistory,
} from 'app/service/interface/notification.interface';
import { action, Action, thunk, Thunk } from 'easy-peasy';
export interface INoticeModel {
  isRedirectNotice: boolean;
  setIsRedirectNotice: Action<INoticeModel, boolean>;

  listNotice: any[];
  setListNotice: Action<INoticeModel, any[]>;

  isListNotice: boolean;
  setIsListNotice: Action<INoticeModel, boolean>;
  getListNotice: Thunk<INoticeModel, IListNotice>;

  listQAndA: any[];
  setListQAndA: Action<INoticeModel, any[]>;

  isListQAndA: boolean;
  setIsListQAndA: Action<INoticeModel, boolean>;
  getListQAndA: Thunk<INoticeModel, IListNotice>;

  listCycleHistory: any[];
  setListCycleHistory: Action<INoticeModel, any[]>;

  isListCycleHistory: boolean;
  setIsListCycleHistory: Action<INoticeModel, boolean>;
  getListCycleHistory: Thunk<INoticeModel, IListHistory>;
}

export const noticeModel: INoticeModel = {
  isRedirectNotice: false,
  setIsRedirectNotice: action((state, payload) => {
    state.isRedirectNotice = payload;
  }),

  listNotice: [],
  setListNotice: action((state, payload) => {
    state.listNotice = payload;
  }),

  isListNotice: false,
  setIsListNotice: action((state, payload) => {
    state.isListNotice = payload;
  }),
  getListNotice: thunk(async (actions, payload) => {
    return listNotice(payload)
      .then(async res => {
        actions.setListNotice(res.data?.data?.data);
        actions.setIsListNotice(true);

        return res.data;
      })
      .catch(error => {
        actions.setIsListNotice(false);
      });
  }),

  listQAndA: [],
  setListQAndA: action((state, payload) => {
    state.listQAndA = payload;
  }),

  listCycleHistory: [],
  setListCycleHistory: action((state, payload) => {
    state.listCycleHistory = payload;
  }),

  isListQAndA: false,
  setIsListQAndA: action((state, payload) => {
    state.isListQAndA = payload;
  }),

  isListCycleHistory: false,
  setIsListCycleHistory: action((state, payload) => {
    state.isListCycleHistory = payload;
  }),

  getListQAndA: thunk(async (actions, payload) => {
    return listQAndA(payload)
      .then(async res => {
        actions.setListQAndA(res.data?.data?.data);
        actions.setIsListQAndA(true);

        return res.data;
      })
      .catch(error => {
        actions.setIsListNotice(false);
      });
  }),

  getListCycleHistory: thunk(async (actions, payload) => {
    return listCycleHistory(payload)
      .then(async res => {
        actions.setListCycleHistory(res.data?.data?.data);
        actions.setIsListCycleHistory(true);
        return res.data;
      })
      .catch(error => {
        actions.setIsListNotice(false);
      });
  }),
};
