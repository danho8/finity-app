import i18n from 'app/i18n';

import {
  advertisementsDetail,
  banners,
  bikeInformationDefault,
  coinHold,
  coins,
  coinsSwap,
  commercial,
  confirmReward,
  confirmSwap,
  goRiceCycling,
  goRiceEndRoad,
  goRiceStart,
  historyDepositAndWithdraw,
  historyToday,
  informationSettingAd,
  reward,
  settingAds,
  updateWallet,
  withdrawalRequest,
  getCollectionId,
} from 'app/service/api/home.service';
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
} from 'app/service/interface/home.interface';
import {IRegion} from 'app/service/interface/map.interface';
import {action, Action, thunk, Thunk} from 'easy-peasy';
import {Alert} from 'react-native';

export const initRicehistory = {
  address_from_json: {latitude: 0, longitude: 0},
  address_current_json: {latitude: 0, longitude: 0},
  average_speed: 0,
  calories: 0,
  content_json: {
    goal: {latitude: 0, longitude: 0},
    mining: 0,
  },
  distance: 0,
  goal_setting: 0, // free = 0 | target = 1
  mining: 0,
  status: 0,
  time: 0,
  created_at: '',
  updated_at: '',
};

interface RiceStart {
  created_at?: string;
  firestore_collection?: {
    document_id?: string;
  };
}

interface RiceHistory {
  address_from_json: {latitude: number; longitude: number};
  address_current_json: {latitude: number; longitude: number};
  average_speed: number;
  calories: number;
  content_json: {
    goal: {latitude: number; longitude: number};
    mining: number;
  };
  distance: number;
  goal_setting: number; // free = 0 | target = 1
  mining: number;
  status: number;
  time: number;
  created_at: string;
  updated_at: string;
}

interface CaloriesFormula {
  data: {
    average_speed_into_calories: {
      [key: string]: number;
    };
    weight: number;
    bike_weight: number;
    comment: string;
    formula: {
      comment: string;
    };
  };
}

interface MiningFormula {
  data: {
    calories_consumeds: {
      [key: string]: number;
    };
    highest_durability: number;
    product_inventory_durability: number;
    ratio_of_durability: number;
    value_category: number;
    level: number;
    comment: string;
    formula: {
      comment: string;
    };
  };
}
export interface IHomeModel {
  advertisements: any;
  setAdvertisements: Action<IHomeModel, any>;

  advertisementsTotal: number;
  setAdvertisementsTotal: Action<IHomeModel, number>;

  listCommercial: any[];
  setListCommercial: Action<IHomeModel, any[]>;

  isCommercial: boolean;
  setIListCommercial: Action<IHomeModel, boolean>;
  getListCommercial: Thunk<IHomeModel, IListCommercial>;

  isAdvertisementsDetail: boolean;
  setIsAdvertisementsDetail: Action<IHomeModel, boolean>;
  advertisementsDetail: Thunk<IHomeModel, IAdvertisementsDetail>;

  isReward: boolean;
  setIsReward: Action<IHomeModel, boolean>;
  reward: Thunk<IHomeModel>;

  isConfirmReward: boolean;
  setIsConfirmReward: Action<IHomeModel, boolean>;
  confirmReward: Thunk<IHomeModel, IConfirmReward>;

  isSettingAds: boolean;
  setIsSettingAds: Action<IHomeModel, boolean>;
  settingAds: Thunk<IHomeModel, ISettingAds>;

  banners: any[];
  setBanners: Action<IHomeModel, any[]>;

  isBanners: boolean;
  setIsBanners: Action<IHomeModel, boolean>;
  getBanners: Thunk<IHomeModel>;

  coins: any[];
  setCoins: Action<IHomeModel, any[]>;

  isCoins: boolean;
  setIsCoins: Action<IHomeModel, boolean>;
  getCoins: Thunk<IHomeModel>;

  isCoinsSwap: boolean;
  setIsCoinsSwap: Action<IHomeModel, boolean>;
  coinsSwap: Thunk<IHomeModel, ICoinsSwap>;

  isConfirmSwap: boolean;
  setIsConfirmSwap: Action<IHomeModel, boolean>;
  confirmSwap: Thunk<IHomeModel, IConfirmSwap>;

  isCoinHold: boolean;
  setIsCoinHold: Action<IHomeModel, boolean>;
  coinHold: Thunk<IHomeModel, ICoinHold>;

  isInformationSettingAd: boolean;
  setIsInformationSettingAd: Action<IHomeModel, boolean>;
  informationSettingAd: Thunk<IHomeModel>;

  isHistoryDepositAndWithdraw: boolean;
  setIsHistoryDepositAndWithdraw: Action<IHomeModel, boolean>;
  historyDepositAndWithdraw: Thunk<IHomeModel, IHistoryDepositAndWithdraw>;

  isWithdrawalRequest: boolean;
  setIsWithdrawalRequest: Action<IHomeModel, boolean>;
  withdrawalRequest: Thunk<IHomeModel, IWithdrawalRequest>;

  isUpdateWallet: boolean;
  setIsUpdateWallet: Action<IHomeModel, boolean>;
  updateWallet: Thunk<IHomeModel, IUpdateWallet>;

  refresh: number;
  setRefresh: Action<IHomeModel, number>;

  isBikeInformationDefault: boolean;
  setIsBikeInformationDefault: Action<IHomeModel, boolean>;
  getBikeInformationDefault: Thunk<IHomeModel>;

  isHistoryToday: boolean;
  setIsHistoryToday: Action<IHomeModel, boolean>;
  getHistoryToday: Thunk<IHomeModel>;

  dataGoRiceStart: any;
  setDataGoRiceStart: Action<IHomeModel, any>;

  isGoRiceStart: boolean;
  setIsGoRiceStart: Action<IHomeModel, boolean>;

  riceStart: RiceStart;
  setRiceStart: Action<IHomeModel, RiceStart>;
  goRiceStart: Thunk<IHomeModel, IGoRiceStart>;

  dataGoRiceCycling: any;
  setDataGoRiceCycling: Action<IHomeModel, any>;

  isGoRiceCycling: boolean;
  setIsGoRiceCycling: Action<IHomeModel, boolean>;
  goRiceCycling: Thunk<IHomeModel, IGoRiceCycling>;

  isGoRiceEndRoad: boolean;
  setIsGoRiceEndRoad: Action<IHomeModel, boolean>;
  goRiceEndRoad: Thunk<IHomeModel, IGoRiceEndRoad>;

  region: IRegion;
  setRegion: Action<IHomeModel, IRegion>;

  isCheckReachedLocationTarget: boolean;
  setIsCheckReachedLocationTarget: Action<IHomeModel, boolean>;

  getCollectionId: Thunk<IHomeModel>;

  riceHistory: RiceHistory;
  setRiceHistory: Action<IHomeModel, RiceHistory>;

  time: number;
  setTime: Action<IHomeModel, number>;
  clearTime: Action<IHomeModel>;

  timeEnd: number;
  setTimeEnd: Action<IHomeModel, number>;

  riceHistoryEnd: RiceHistory;
  setRiceHistoryEnd: Action<IHomeModel, RiceHistory>;

  isFreeBike: boolean;
  setIsFreeBike: Action<IHomeModel, boolean>;

  formulas: {
    calories?: CaloriesFormula;
    mining?: MiningFormula;
  };
  setFormulas: Action<
    IHomeModel,
    {
      calories?: CaloriesFormula;
      mining?: MiningFormula;
    }
  >;

  heading: number | null;
  setHeading: Action<IHomeModel, number | null>;
}

export const homeModel: IHomeModel = {
  isFreeBike: false,
  setIsFreeBike: action((state, payload) => {
    state.isFreeBike = payload;
  }),

  advertisements: false,
  setAdvertisements: action((state, payload) => {
    state.advertisements = payload;
  }),

  advertisementsTotal: 0,
  setAdvertisementsTotal: action((state, payload) => {
    state.advertisementsTotal = payload;
  }),

  listCommercial: [],
  setListCommercial: action((state, payload) => {
    state.listCommercial = payload;
  }),

  isCommercial: false,
  setIListCommercial: action((state, payload) => {
    state.isCommercial = payload;
  }),
  getListCommercial: thunk(async (actions, payload) => {
    return commercial(payload)
      .then(async res => {
        actions.setListCommercial(res.data?.data?.data);
        actions.setAdvertisementsTotal(res.data?.data?.total);
        actions.setIListCommercial(true);

        return res.data;
      })
      .catch(() => {
        actions.setIListCommercial(false);
      });
  }),

  isAdvertisementsDetail: false,
  setIsAdvertisementsDetail: action((state, payload) => {
    state.isAdvertisementsDetail = payload;
  }),
  advertisementsDetail: thunk(async (actions, payload) => {
    return advertisementsDetail(payload)
      .then(async res => {
        actions.setIsAdvertisementsDetail(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsAdvertisementsDetail(false);
      });
  }),

  isReward: false,
  setIsReward: action((state, payload) => {
    state.isReward = payload;
  }),
  reward: thunk(async actions => {
    return reward()
      .then(async res => {
        actions.setIsReward(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsReward(false);
      });
  }),

  isConfirmReward: false,
  setIsConfirmReward: action((state, payload) => {
    state.isConfirmReward = payload;
  }),
  confirmReward: thunk(async (actions, payload) => {
    return confirmReward(payload)
      .then(async res => {
        if (!res?.data?.success) {
          actions.setIsConfirmReward(false);
          return false;
        }
        actions.setIsConfirmReward(true);
        Alert.alert(res.data.message);

        return res.data;
      })
      .catch(() => {
        actions.setIsConfirmReward(false);
      });
  }),

  isSettingAds: false,
  setIsSettingAds: action((state, payload) => {
    state.isSettingAds = payload;
  }),
  settingAds: thunk(async (actions, payload) => {
    return settingAds(payload)
      .then(async res => {
        actions.setIsSettingAds(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsSettingAds(false);
      });
  }),

  banners: [],
  setBanners: action((state, payload) => {
    state.banners = payload;
  }),

  isBanners: false,
  setIsBanners: action((state, payload) => {
    state.isBanners = payload;
  }),
  getBanners: thunk(async actions => {
    return banners()
      .then(async res => {
        actions.setBanners(res.data?.data?.banners);
        actions.setIsSettingAds(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsSettingAds(false);
      });
  }),

  coins: [],
  setCoins: action((state, payload) => {
    state.coins = payload;
  }),

  isCoins: false,
  setIsCoins: action((state, payload) => {
    state.isBanners = payload;
  }),
  getCoins: thunk(async actions => {
    return coins()
      .then(async res => {
        actions.setCoins(res.data?.data);
        actions.setIsCoins(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsCoins(false);
      });
  }),

  isCoinsSwap: false,
  setIsCoinsSwap: action((state, payload) => {
    state.isCoinsSwap = payload;
  }),
  coinsSwap: thunk(async (actions, payload) => {
    return coinsSwap(payload)
      .then(async res => {
        actions.setIsCoinsSwap(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsCoins(false);
      });
  }),

  isConfirmSwap: false,
  setIsConfirmSwap: action((state, payload) => {
    state.isConfirmSwap = payload;
  }),
  confirmSwap: thunk(async (actions, payload) => {
    return confirmSwap(payload)
      .then(async res => {
        actions.setIsConfirmSwap(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsCoins(false);
      });
  }),

  isCoinHold: false,
  setIsCoinHold: action((state, payload) => {
    state.isCoinHold = payload;
  }),
  coinHold: thunk(async (actions, payload) => {
    return coinHold(payload)
      .then(async res => {
        actions.setIsCoinHold(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsCoins(false);
      });
  }),

  isInformationSettingAd: false,
  setIsInformationSettingAd: action((state, payload) => {
    state.isInformationSettingAd = payload;
  }),
  informationSettingAd: thunk(async actions => {
    return informationSettingAd()
      .then(async res => {
        actions.setIsInformationSettingAd(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsInformationSettingAd(false);
      });
  }),

  isHistoryDepositAndWithdraw: false,
  setIsHistoryDepositAndWithdraw: action((state, payload) => {
    state.isHistoryDepositAndWithdraw = payload;
  }),
  historyDepositAndWithdraw: thunk(async (actions, payload) => {
    return historyDepositAndWithdraw(payload)
      .then(async res => {
        actions.setIsHistoryDepositAndWithdraw(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsHistoryDepositAndWithdraw(false);
      });
  }),

  isWithdrawalRequest: false,
  setIsWithdrawalRequest: action((state, payload) => {
    state.isWithdrawalRequest = payload;
  }),
  withdrawalRequest: thunk(async (actions, payload) => {
    return withdrawalRequest(payload)
      .then(async res => {
        actions.setIsWithdrawalRequest(true);

        if (res.data?.data?.status == 1) {
          Alert.alert(i18n.t("You_don't_have_enough_money"));
        }

        return res.data;
      })
      .catch(() => {
        Alert.alert(i18n.t('Withdrawal_failed'));
        actions.setIsWithdrawalRequest(false);
      });
  }),

  isUpdateWallet: false,
  setIsUpdateWallet: action((state, payload) => {
    state.isUpdateWallet = payload;
  }),
  updateWallet: thunk(async (actions, payload) => {
    return updateWallet(payload)
      .then(async res => {
        actions.setIsUpdateWallet(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsUpdateWallet(false);
      });
  }),

  refresh: 0,
  setRefresh: action((state, payload) => {
    state.refresh = payload;
  }),

  isBikeInformationDefault: false,
  setIsBikeInformationDefault: action((state, payload) => {
    state.isBikeInformationDefault = payload;
  }),
  getBikeInformationDefault: thunk(async actions => {
    return bikeInformationDefault()
      .then(async res => {
        actions.setIsBikeInformationDefault(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsBikeInformationDefault(false);
      });
  }),

  isHistoryToday: false,
  setIsHistoryToday: action((state, payload) => {
    state.isHistoryToday = payload;
  }),
  getHistoryToday: thunk(async actions => {
    return historyToday()
      .then(async res => {
        actions.setIsHistoryToday(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsHistoryToday(false);
      });
  }),

  dataGoRiceStart: false,
  setDataGoRiceStart: action((state, payload) => {
    state.dataGoRiceStart = payload;
  }),

  isGoRiceStart: false,
  setIsGoRiceStart: action((state, payload) => {
    state.isGoRiceStart = payload;
  }),
  riceStart: {},
  setRiceStart: action((state, payload) => {
    state.riceStart = payload;
  }),
  goRiceStart: thunk(async (actions, payload) => {
    return goRiceStart(payload)
      .then(async res => {
        if (!res?.data?.success) {
          actions.setIsGoRiceStart(false);
          return false;
        }
        actions.setIsGoRiceStart(true);

        actions.setRiceStart(res.data.data);
        actions.setFormulas(res.data.data.formulas);
        actions.setIsFreeBike(res.data?.data?.is_free_bike);
        return res.data;
      })
      .catch(error => {
        console.log('error', error);
        actions.setIsGoRiceStart(false);
      });
  }),

  dataGoRiceCycling: false,
  setDataGoRiceCycling: action((state, payload) => {
    state.dataGoRiceCycling = payload;
  }),

  isGoRiceCycling: false,
  setIsGoRiceCycling: action((state, payload) => {
    state.isGoRiceCycling = payload;
  }),
  goRiceCycling: thunk(async (actions, payload) => {
    return goRiceCycling(payload)
      .then(async res => {
        if (!res?.data?.success) {
          actions.setIsGoRiceCycling(false);
          return false;
        }
        actions.setIsGoRiceCycling(true);

        return res.data;
      })
      .catch(() => {
        actions.setIsGoRiceCycling(false);
      });
  }),

  isGoRiceEndRoad: false,
  setIsGoRiceEndRoad: action((state, payload) => {
    state.isGoRiceEndRoad = payload;
  }),
  goRiceEndRoad: thunk(async (actions, payload, stores) => {
    return goRiceEndRoad(payload)
      .then(async res => {
        if (!res?.data?.success) {
          actions.setIsGoRiceEndRoad(false);
          Alert.alert(res?.data?.message);
          return false;
        }
        actions.setIsGoRiceEndRoad(true);
        actions.setDataGoRiceCycling(res.data.data);
        actions.setRiceHistoryEnd(stores.getState().riceHistory);
        actions.setHeading(-1);
        actions.setRiceHistory(initRicehistory);
        actions.clearTime();
        actions.setIsFreeBike(false);
        return res.data;
      })
      .catch(() => {
        actions.setIsGoRiceEndRoad(false);
      });
  }),

  getCollectionId: thunk(async actions => {
    return getCollectionId()
      .then(async res => {
        if (!res?.data?.success) {
          actions.setRiceStart({});
          throw new Error('no data');
        }

        actions.setRiceStart(res.data.data);
        actions.setFormulas(res.data.data.formulas);
        return Promise.resolve(res.data.data);
      })
      .catch(error => {
        actions.setIsGoRiceEndRoad(false);
        return Promise.reject(error);
      });
  }),

  region: {
    latitude: 0,
    longitude: 0,
  },
  setRegion: action((state, payload) => {
    state.region = payload;
  }),

  isCheckReachedLocationTarget: false,
  setIsCheckReachedLocationTarget: action((state, payload) => {
    state.isCheckReachedLocationTarget = payload;
  }),

  riceHistory: initRicehistory,
  setRiceHistory: action((state, payload) => {
    state.riceHistory = payload;
  }),
  formulas: {},
  setFormulas: action((state, payload) => {
    state.formulas = payload;
  }),
  time: 0,
  setTime: action((state, payload) => {
    state.time = state.time + payload;
  }),
  clearTime: action(state => {
    state.time = 0;
  }),

  timeEnd: 0,
  setTimeEnd: action((state, payload) => {
    state.timeEnd = payload;
  }),

  riceHistoryEnd: initRicehistory,
  setRiceHistoryEnd: action((state, payload) => {
    state.riceHistoryEnd = payload;
  }),

  heading: -1,
  setHeading: action((state, payload) => {
    state.heading = payload;
  }),
};
