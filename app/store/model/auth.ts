import { LINK_IMAGE_DEFAULT } from 'app/config/constant-config';
import { persist, action, Action, Thunk, thunk } from 'easy-peasy';
import { Alert } from 'react-native';
import i18n from '../../i18n';
import {
  authSns,
  changePassword,
  confirmEmail,
  emailVerification,
  getFindAccount,
  getProfile,
  getWallets,
  leaveGroup,
  login,
  logout,
  nations,
  refreshToken,
  register,
  saveDeviceToken,
  updatedUser,
  updatePassword,
  uploadImage,
  usersSearch,
  bodyInformation,
  getHistoriesCycle,
  getHistoriesCycleDetail,
} from '../../service/api/auth.service';
import {
  IAuthSns,
  IConfirmEmail,
  IEmailVerification,
  IFindAccount,
  ILeaveGroup,
  ILogin,
  IRegister,
  ISaveDeviceToken,
  IUpdatedUser,
  IUpdatePassword,
  IUsersSearch,
  IBodyInformation,
  IHistoriesCycle,
  IHistoriesCycleDetail,
} from '../../service/interface/auth.interface';
import { AsyncStorageTransform } from '../../utils/AsyncStorageTransform';
import { storage } from '../storage';
export interface IAuthModel {
  token: string | boolean;
  setToken: Action<IAuthModel, string | boolean>;

  refreshToken: string | boolean;
  setRefreshToken: Action<IAuthModel, string | boolean>;

  isAutoLogin: boolean;
  setIsAutoLogin: Action<IAuthModel, boolean>;

  isLoginError: boolean;
  setIsLoginError: Action<IAuthModel, boolean>;

  isLoginSuccess: boolean;
  setIsLoginSuccess: Action<IAuthModel, boolean>;
  login: Thunk<IAuthModel, ILogin>;

  user: any;
  setUser: Action<IAuthModel, any>;

  isRegister: boolean;
  setIsRegister: Action<IAuthModel, boolean>;
  register: Thunk<IAuthModel, IRegister>;

  isEmailVerification: boolean;
  setIsEmailVerification: Action<IAuthModel, boolean>;
  emailVerification: Thunk<IAuthModel, IEmailVerification>;

  isConfirmEmail: number;
  setIsConfirmEmail: Action<IAuthModel, number>;
  confirmEmail: Thunk<IAuthModel, IConfirmEmail>;

  listNations: any[];
  setListNations: Action<IAuthModel, any[]>;
  nations: Thunk<IAuthModel>;

  isLogout: boolean;
  setIsLogout: Action<IAuthModel, boolean>;
  logout: Thunk<IAuthModel>;

  isLeaveGroup: boolean;
  setIsLeaveGroup: Action<IAuthModel, boolean>;
  leaveGroup: Thunk<IAuthModel, ILeaveGroup>;

  isLeaveGroupError: boolean;
  setIsLeaveGroupError: Action<IAuthModel, boolean>;

  isRefreshToken: boolean;
  setIsRefreshToken: Action<IAuthModel, boolean>;
  getRefreshToken: Thunk<IAuthModel>;

  isGetProfile: boolean;
  setIsGetProfile: Action<IAuthModel, boolean>;
  getProfile: Thunk<IAuthModel>;

  isUpdatedUser: boolean;
  setIsUpdatedUser: Action<IAuthModel, boolean>;
  updatedUser: Thunk<IAuthModel, IUpdatedUser>;

  isUpdatePassword: number;
  setIsUpdatePassword: Action<IAuthModel, number>;
  updatePassword: Thunk<IAuthModel, IUpdatePassword>;
  changePassword: Thunk<IAuthModel, IUpdatePassword>;

  isFindAccount: number;
  setIsGetFindAccount: Action<IAuthModel, number>;
  getFindAccount: Thunk<IAuthModel, IFindAccount>;

  wallets: any[];
  setWallets: Action<IAuthModel, any[]>;

  isWallets: boolean;
  setIsWallets: Action<IAuthModel, boolean>;
  getWallets: Thunk<IAuthModel>;

  isUploadImage: boolean;
  setIsUploadImage: Action<IAuthModel, boolean>;
  uploadImage: Thunk<IAuthModel, FormData>;

  listUser: any[];
  setListUser: Action<IAuthModel, any[]>;

  isUsersSearch: boolean;
  setIsUsersSearch: Action<IAuthModel, boolean>;
  usersSearch: Thunk<IAuthModel, IUsersSearch>;

  isAuthSns: boolean;
  setIsAuthSns: Action<IAuthModel, boolean>;
  authSns: Thunk<IAuthModel, IAuthSns>;

  fcmToken: string | boolean;
  setFcmToken: Action<IAuthModel, string | boolean>;

  isSaveDeviceToken: boolean;
  setIsSaveDeviceToken: Action<IAuthModel, boolean>;
  saveDeviceToken: Thunk<IAuthModel, ISaveDeviceToken>;

  isBodyInformationConfirm: boolean;
  setIsBodyInformationConfirm: Action<IAuthModel, boolean>;
  bodyInformationConfirm: Thunk<IAuthModel, IBodyInformation>;

  isTheFirstUpdateInformation: boolean;
  setIsTheFirstUpdateInformation: Action<IAuthModel, boolean>;

  isHistoriesCycle: boolean;
  setIsHistoriesCycle: Action<IAuthModel, boolean>;

  historiesCycle: any[];
  setHistoriesCycle: Action<IAuthModel, any[]>;
  getHistoriesCycle: Thunk<IAuthModel, IHistoriesCycle>;

  historiesCycleDetail: null;
  setHistoriesCycleDetail: Action<IAuthModel, null>;
  getHistoriesCycleDetail: Thunk<IAuthModel, IHistoriesCycleDetail>;

  isCheckMyPage: boolean;
  setIsCheckMyPage: Action<IAuthModel, boolean>;
}

export const authModel: IAuthModel = persist(
  {
    token: false,
    setToken: action((state, payload) => {
      state.token = payload;
    }),

    refreshToken: false,
    setRefreshToken: action((state, payload) => {
      state.refreshToken = payload;
    }),

    isAutoLogin: false,
    setIsAutoLogin: action((state, payload) => {
      state.isAutoLogin = payload;
    }),

    isLoginError: false,
    setIsLoginError: action((state, payload) => {
      state.isLoginError = payload;
    }),

    isLoginSuccess: false,
    setIsLoginSuccess: action((state, payload) => {
      state.isLoginSuccess = payload;
    }),
    login: thunk(async (actions, payload, injections) => {
      return login(payload)
        .then(async res => {
          if (!res?.data?.success) {
            actions.setIsLoginSuccess(false);
            actions.setIsLoginError(true);
            return false;
          }
          actions.setUser({
            ...res.data?.data?.user,
            uri: LINK_IMAGE_DEFAULT,
          });
          storage.setItem('token', res.data?.data?.token);
          injections.getState().isAutoLogin &&
            storage.setItem('isAutoLogin', injections.getState().isAutoLogin);
          actions.setToken(res.data?.data?.token);
          actions.setIsLoginSuccess(true);
          actions.setIsLoginError(false);

          return res.data;
        })
        .catch(error => {
          actions.setIsLoginSuccess(false);
          actions.setIsLoginError(true);
        });
    }),

    user: {
      uri: LINK_IMAGE_DEFAULT,
    },
    setUser: action((state, payload) => {
      state.user = payload;
    }),

    isRegister: false,
    setIsRegister: action((state, payload) => {
      state.isRegister = payload;
    }),
    register: thunk(async (actions, payload) => {
      return register(payload)
        .then(async res => {
          actions.setIsRegister(true);
          return res.data;
        })
        .catch(error => {
          actions.setIsRegister(false);
        });
    }),

    isEmailVerification: false,
    setIsEmailVerification: action((state, payload) => {
      state.isEmailVerification = payload;
    }),
    emailVerification: thunk(async (actions, payload) => {
      return emailVerification(payload)
        .then(async res => {
          actions.setIsEmailVerification(true);
          return res.data;
        })
        .catch(error => {
          if (error?.message?.includes('422')) {
            Alert.alert(i18n.t('register.error_email_already_exits'));
          } else {
            Alert.alert(i18n.t('register.error_register'));
          }
          actions.setIsEmailVerification(false);
        });
    }),

    isConfirmEmail: 1,
    setIsConfirmEmail: action((state, payload) => {
      state.isConfirmEmail = payload;
    }),
    confirmEmail: thunk(async (actions, payload) => {
      return confirmEmail(payload)
        .then(async res => {
          if (!res?.data?.success) {
            actions.setIsConfirmEmail(3);
            return false;
          }
          actions.setIsConfirmEmail(2);
          return res.data;
        })
        .catch(error => {
          actions.setIsConfirmEmail(3);
        });
    }),

    listNations: [],
    setListNations: action((state, payload) => {
      state.listNations = payload;
    }),
    nations: thunk(async actions => {
      return nations()
        .then(async res => {
          actions.setListNations(res.data.data);
          return res.data;
        })
        .catch(error => {
          console.log('nations: ', error);
        });
    }),

    isLogout: false,
    setIsLogout: action((state, payload) => {
      state.isLogout = payload;
    }),
    logout: thunk(async actions => {
      return logout()
        .then(async res => {
          actions.setIsLogout(false);

          return res.data;
        })
        .catch(error => {
          actions.setIsLogout(true);
        });
    }),

    isLeaveGroup: false,
    setIsLeaveGroup: action((state, payload) => {
      state.isLeaveGroup = payload;
    }),

    leaveGroup: thunk(async (actions, payload) => {
      return leaveGroup(payload)
        .then(async res => {
          actions.setIsLeaveGroup(true);
          actions.setIsLeaveGroupError(false);
          return res.data;
        })
        .catch(error => {
          actions.setIsLeaveGroup(false);
          actions.setIsLeaveGroupError(true);
        });
    }),

    isLeaveGroupError: false,
    setIsLeaveGroupError: action((state, payload) => {
      state.isLeaveGroupError = payload;
    }),

    isRefreshToken: false,
    setIsRefreshToken: action((state, payload) => {
      state.isRefreshToken = payload;
    }),
    getRefreshToken: thunk(async actions => {
      return refreshToken()
        .then(async res => {
          storage.setItem('token', res.data?.data?.token);
          actions.setToken(res.data?.data?.token);
          actions.setIsRefreshToken(true);

          return res.data;
        })
        .catch(error => {
          actions.setIsRefreshToken(false);
        });
    }),

    isGetProfile: false,
    setIsGetProfile: action((state, payload) => {
      state.isGetProfile = payload;
    }),
    getProfile: thunk(async actions => {
      return getProfile()
        .then(async res => {
          actions.setUser({
            ...res.data?.data,
            uri: LINK_IMAGE_DEFAULT,
          });
          actions.setIsGetProfile(true);

          return res.data;
        })
        .catch(error => {
          actions.setIsGetProfile(false);
        });
    }),

    isUpdatedUser: false,
    setIsUpdatedUser: action((state, payload) => {
      state.isUpdatedUser = payload;
    }),
    updatedUser: thunk(async (actions, payload) => {
      return updatedUser(payload)
        .then(async res => {
          actions.setIsUpdatedUser(true);

          return res.data;
        })
        .catch(error => {
          actions.setIsUpdatedUser(false);
        });
    }),

    isUpdatePassword: 1,
    setIsUpdatePassword: action((state, payload) => {
      state.isUpdatePassword = payload;
    }),
    updatePassword: thunk(async (actions, payload) => {
      return updatePassword(payload)
        .then(async res => {
          if (!res?.data?.success) {
            actions.setIsUpdatePassword(3);

            return false;
          }
          actions.setIsUpdatePassword(2);

          return res.data;
        })
        .catch(error => {
          actions.setIsUpdatePassword(3);
        });
    }),

    changePassword: thunk(async (actions, payload) => {
      return changePassword(payload)
        .then(async res => {
          // change success
          if (!!!res?.data?.success) {
            // success false
            actions.setIsUpdatePassword(3);

            return false;
          }
          actions.setIsUpdatePassword(2);
          return res.data;
        })
        .catch(error => {
          actions.setIsUpdatePassword(3);
        });
    }),

    isFindAccount: 1,
    setIsGetFindAccount: action((state, payload) => {
      state.isFindAccount = payload;
    }),
    getFindAccount: thunk(async (actions, payload) => {
      return getFindAccount(payload)
        .then(async res => {
          if (!res?.data?.success) {
            actions.setIsGetFindAccount(3);
            return false;
          }
          actions.setUser({
            ...res.data?.data,
            uri: LINK_IMAGE_DEFAULT,
          });
          actions.setIsGetFindAccount(2);
          return res.data;
        })
        .catch(error => {
          actions.setIsGetFindAccount(3);
        });
    }),

    wallets: [],
    setWallets: action((state, payload) => {
      state.wallets = payload;
    }),

    isWallets: false,
    setIsWallets: action((state, payload) => {
      state.isWallets = payload;
    }),
    getWallets: thunk(async (actions, _payload, stores) => {
      return getWallets()
        .then(async res => {
          actions.setWallets(res.data?.data);
          actions.setIsWallets(true);
          return res.data;
        })
        .catch(error => {
          if (stores.getState().token) {
            if (error?.message.includes('401')) {
              actions.setToken(false);
              storage.removeItem('token');
              Alert.alert(i18n.t('notification.login_on_another_device'));
              actions.setWallets([]);
            } else if (error?.message.includes('403')) {
              actions.setToken(false);
              storage.removeItem('token');
              Alert.alert(i18n.t('notification.account_blocked'));
              actions.setWallets([]);
            }
          }
          actions.setIsWallets(false);
        });
    }),

    isUploadImage: false,
    setIsUploadImage: action((state, payload) => {
      state.isUploadImage = payload;
    }),
    uploadImage: thunk(async (actions, payload) => {
      return uploadImage(payload)
        .then(async res => {
          actions.setIsUploadImage(true);
          return res.data;
        })
        .catch(error => {
          actions.setIsUploadImage(false);
        });
    }),

    listUser: [],
    setListUser: action((state, payload) => {
      state.listUser = payload;
    }),

    isUsersSearch: false,
    setIsUsersSearch: action((state, payload) => {
      state.isUsersSearch = payload;
    }),
    usersSearch: thunk(async (actions, payload) => {
      return usersSearch(payload)
        .then(async res => {
          actions.setListUser(res.data?.data);
          actions.setIsUsersSearch(true);
          return res.data;
        })
        .catch(error => {
          actions.setIsUsersSearch(false);
        });
    }),

    isAuthSns: false,
    setIsAuthSns: action((state, payload) => {
      state.isAuthSns = payload;
    }),
    authSns: thunk(async (actions, payload) => {
      return authSns(payload)
        .then(async res => {
          actions.setIsAuthSns(true);
          return res.data;
        })
        .catch(error => {
          actions.setIsAuthSns(false);
        });
    }),

    fcmToken: false,
    setFcmToken: action((state, payload) => {
      state.fcmToken = payload;
    }),

    isSaveDeviceToken: false,
    setIsSaveDeviceToken: action((state, payload) => {
      state.isSaveDeviceToken = payload;
    }),
    saveDeviceToken: thunk(async (actions, payload) => {
      return saveDeviceToken(payload)
        .then(async res => {
          actions.setIsSaveDeviceToken(true);
          return res.data;
        })
        .catch(error => {
          actions.setIsSaveDeviceToken(false);
        });
    }),

    isBodyInformationConfirm: false,
    setIsBodyInformationConfirm: action((state, payload) => {
      state.isBodyInformationConfirm = payload;
    }),
    bodyInformationConfirm: thunk(async (actions, payload) => {
      return bodyInformation(payload)
        .then(res => {
          if (!res?.data?.success) {
            actions.setIsBodyInformationConfirm(false);
            return false;
          }
          actions.setIsBodyInformationConfirm(true);
          return res?.data;
        })
        .catch(error => {
          actions.setIsBodyInformationConfirm(false);
        });
    }),

    isTheFirstUpdateInformation: false,
    setIsTheFirstUpdateInformation: action((state, payload) => {
      state.isTheFirstUpdateInformation = payload;
    }),

    isHistoriesCycle: false,
    setIsHistoriesCycle: action((state, payload) => {
      state.isHistoriesCycle = payload;
    }),

    historiesCycle: [],
    setHistoriesCycle: action((state, payload) => {
      state.historiesCycle = payload;
    }),
    getHistoriesCycle: thunk(async (actions, payload) => {
      return getHistoriesCycle(payload)
        .then(res => {
          actions.setHistoriesCycle(res?.data?.data?.data);
          actions.setIsHistoriesCycle(true);
          return res;
        })
        .catch(error => {
          actions.setHistoriesCycle([]);
        });
    }),

    historiesCycleDetail: null,
    setHistoriesCycleDetail: action((state, payload) => {
      state.historiesCycleDetail = payload;
    }),
    getHistoriesCycleDetail: thunk(async (actions, payload) => {
      return getHistoriesCycleDetail(payload)
        .then(async res => {
          actions.setHistoriesCycleDetail(res?.data?.data);
          return res;
        })
        .catch(error => {
          actions.setHistoriesCycleDetail(null);
        });
    }),

    isCheckMyPage: false,
    setIsCheckMyPage: action((state, payload) => {
      state.isCheckMyPage = payload;
    }),
  },
  { storage: storage, transformers: [AsyncStorageTransform] },
);
