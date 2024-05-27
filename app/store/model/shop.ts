import i18n from 'app/i18n';
import {
  buyProduct,
  giveProduct,
  listShop,
  priceUpgrade,
  productInventory,
  productUpgrade,
  repair,
  repairFees,
  settingBike,
  getStatusFunctions
} from 'app/service/api/shop.service';
import {
  IBuyProduct,
  IGiveProduct,
  IListShop,
  IProductInventory,
  IProductUpgrade,
  IRepair,
  IRepairFees,
  ISettingBike,
} from 'app/service/interface/shop.interface';
import { action, Action, thunk, Thunk } from 'easy-peasy';
import { Alert } from 'react-native';
export interface IShopModel {
  coin: any | boolean;
  setCoin: Action<IShopModel, any | boolean>;

  listCoinMerge: any[];
  setListCoinMerge: Action<IShopModel, any[]>;

  isContinueVideo: boolean;
  setIsContinueVideo: Action<IShopModel, boolean>;

  listShop: any[];
  setListShop: Action<IShopModel, any[]>;

  isListShop: boolean;
  setIsListShop: Action<IShopModel, boolean>;
  getListShop: Thunk<IShopModel, IListShop>;

  listInventory: any[];
  setListInventory: Action<IShopModel, any[]>;

  isProductInventory: boolean;
  setIsProductInventory: Action<IShopModel, boolean>;
  productInventory: Thunk<IShopModel, IProductInventory>;

  isStatusFunctions: boolean;
  setIsStatusFunctions: Action<IShopModel, boolean>;
  getStatusFunctions: Thunk<IShopModel>;

  isBuyProduct: boolean;
  setIsBuyProduct: Action<IShopModel, boolean>;
  buyProduct: Thunk<IShopModel, IBuyProduct>;

  priceUpgrade: any | boolean;
  setPriceUpgrade: Action<IShopModel, any | boolean>;

  isPriceUpgrade: boolean;
  setIsPriceUpgrade: Action<IShopModel, boolean>;
  getPriceUpgrade: Thunk<IShopModel, IBuyProduct>;

  isProductUpgrade: boolean;
  setIsProductUpgrade: Action<IShopModel, boolean>;
  productUpgrade: Thunk<IShopModel, IProductUpgrade>;

  repairFees: any;
  setRepairFees: Action<IShopModel, any>;

  isRepairFees: boolean;
  setIsRepairFees: Action<IShopModel, boolean>;
  getRepairFees: Thunk<IShopModel, IRepairFees>;

  isRepair: boolean;
  setIsRepair: Action<IShopModel, boolean>;
  repair: Thunk<IShopModel, IRepair>;

  isGiveProduct: boolean;
  setIsGiveProduct: Action<IShopModel, boolean>;
  giveProduct: Thunk<IShopModel, IGiveProduct>;

  isSettingBike: boolean;
  setIsSettingBike: Action<IShopModel, boolean>;
  settingBike: Thunk<IShopModel, ISettingBike>;
}

export const shopModel: IShopModel = {
  coin: false,
  setCoin: action((state, payload) => {
    state.coin = payload;
  }),

  listCoinMerge: [],
  setListCoinMerge: action((state, payload) => {
    state.listCoinMerge = payload;
  }),

  isContinueVideo: false,
  setIsContinueVideo: action((state, payload) => {
    state.isContinueVideo = payload;
  }),

  listShop: [],
  setListShop: action((state, payload) => {
    state.listShop = payload;
  }),

  isListShop: false,
  setIsListShop: action((state, payload) => {
    state.isListShop = payload;
  }),
  getListShop: thunk(async (actions, payload) => {
    return listShop(payload)
      .then(async res => {
        actions.setListShop(res.data?.data?.data);
        actions.setIsListShop(false);

        return res.data;
      })
      .catch(error => {
        actions.setIsListShop(true);
      });
  }),

  listInventory: [],
  setListInventory: action((state, payload) => {
    state.listInventory = payload;
  }),

  isProductInventory: false,
  setIsProductInventory: action((state, payload) => {
    state.isProductInventory = payload;
  }),
  productInventory: thunk(async (actions, payload) => {
    return productInventory(payload)
      .then(async res => {
        if (!res?.data?.success) {
          actions.setIsProductInventory(false);
          return false;
        }
        actions.setListInventory(res.data?.data.data);
        actions.setIsProductInventory(true);

        return res.data;
      })
      .catch(error => {
        actions.setIsProductInventory(false);
      });
  }),

  isStatusFunctions: false,
  setIsStatusFunctions: action((state, payload) => {
    state.isStatusFunctions = payload;
  }),
  getStatusFunctions: thunk(async (actions) => {
    return getStatusFunctions()
      .then(async res => {
        if (res?.data?.data?.payment) {
          actions.setIsStatusFunctions(true);
        } else {
          actions.setIsStatusFunctions(false);
          return false;
        }

        return res.data;
      })
      .catch(error => {
        actions.setIsStatusFunctions(true);
      });
  }),
  isBuyProduct: false,
  setIsBuyProduct: action((state, payload) => {
    state.isBuyProduct = payload;
  }),
  buyProduct: thunk(async (actions, payload) => {
    return buyProduct(payload)
      .then(async res => {

        if (!res?.data?.success) {
          actions.setIsBuyProduct(false);
          return false;
        }

        actions.setIsBuyProduct(true);
        return res.data;
      })
      .catch(error => {
        actions.setIsBuyProduct(false);
      });
  }),

  priceUpgrade: false,
  setPriceUpgrade: action((state, payload) => {
    state.priceUpgrade = payload;
  }),

  isPriceUpgrade: false,
  setIsPriceUpgrade: action((state, payload) => {
    state.isPriceUpgrade = payload;
  }),
  getPriceUpgrade: thunk(async (actions, payload) => {
    return priceUpgrade(payload)
      .then(async res => {
        actions.setPriceUpgrade(res.data?.data);
        actions.setIsPriceUpgrade(true);

        return res.data;
      })
      .catch(error => {
        actions.setIsPriceUpgrade(false);
      });
  }),

  isProductUpgrade: false,
  setIsProductUpgrade: action((state, payload) => {
    state.isProductUpgrade = payload;
  }),
  productUpgrade: thunk(async (actions, payload) => {
    return productUpgrade(payload)
      .then(async res => {
        if (!res?.data?.success) {
          Alert.alert(res?.data?.message);
          actions.setIsPriceUpgrade(false);
          return false;
        }
        actions.setIsProductUpgrade(true);

        return res.data;
      })
      .catch(error => {
        Alert.alert(i18n.t('error_something'));
        actions.setIsPriceUpgrade(false);
      });
  }),

  repairFees: false,
  setRepairFees: action((state, payload) => {
    state.repairFees = payload;
  }),

  isRepairFees: false,
  setIsRepairFees: action((state, payload) => {
    state.isRepairFees = payload;
  }),
  getRepairFees: thunk(async (actions, payload) => {
    return repairFees(payload)
      .then(async res => {
        actions.setRepairFees(res.data?.data?.repair_fees);
        actions.setIsRepairFees(true);

        return res.data;
      })
      .catch(error => {
        actions.setIsPriceUpgrade(false);
      });
  }),

  isRepair: false,
  setIsRepair: action((state, payload) => {
    state.isRepair = payload;
  }),
  repair: thunk(async (actions, payload) => {
    return repair(payload)
      .then(async res => {
        if (!res?.data?.success) {
          Alert.alert(i18n.t('error_something'));
          actions.setIsPriceUpgrade(false);
          return false;
        }
        actions.setIsRepair(true);

        return res.data;
      })
      .catch(error => {
        Alert.alert(i18n.t('error_something'));
        actions.setIsPriceUpgrade(false);
      });
  }),

  isGiveProduct: false,
  setIsGiveProduct: action((state, payload) => {
    state.isGiveProduct = payload;
  }),
  giveProduct: thunk(async (actions, payload) => {
    return giveProduct(payload)
      .then(async res => {
        if (res.data?.data?.status != 1) {
          actions.setIsGiveProduct(true);
        }

        return res.data;
      })
      .catch(error => {
        actions.setIsGiveProduct(false);
      });
  }),

  isSettingBike: false,
  setIsSettingBike: action((state, payload) => {
    state.isSettingBike = payload;
  }),
  settingBike: thunk(async (actions, payload) => {
    return settingBike(payload)
      .then(async res => {
        if (!res?.data?.success) {
          actions.setIsSettingBike(false);
          return false;
        }
        actions.setIsSettingBike(true);

        return res?.data;
      })
      .catch(error => {
        actions.setIsSettingBike(false);
      });
  }),
};
