import request from "../../utils/api/baseAxios";
import requestUploadFile from "../../utils/api/baseUploadFile";
import { IAuthSns, IConfirmEmail, IEmailVerification, IFindAccount, ILeaveGroup, ILogin, IRegister, ISaveDeviceToken, IUpdatedUser, IUpdatePassword, IUsersSearch, IBodyInformation, IHistoriesCycleDetail, IHistoriesCycle } from "../interface/auth.interface";


const login = (data: ILogin) => {
  return request({
    url: `/login`,
    method: 'POST',
    data,
  });
};

const logout = () => {
  return request({
    url: `/logout`,
    method: 'POST',
  });
};

const register = (data: IRegister) => {
  return request({
    url: `/register`,
    method: 'POST',
    data,
  });
};

const emailVerification = (data: IEmailVerification) => {
  return request({
    url: `/email-verification`,
    method: 'POST',
    data,
  });
};

const confirmEmail = (data: IConfirmEmail) => {
  return request({
    url: `/confirm-email`,
    method: 'POST',
    data,
  });
};

const nations = () => {
  return request({
    url: `/nations`,
    method: 'GET',
  });
};

const refreshToken = () => {
  return request({
    url: `/auth/refresh-token`,
    method: 'GET',
  });
};

const getProfile = () => {
  return request({
    url: `/users/profile`,
    method: 'GET',
  });
};

const leaveGroup =(data:ILeaveGroup)=>{
  return request({
    url:'/users/secession',
    method:'POST',
    data,
  });
}

const updatedUser =(data: IUpdatedUser)=>{
  return request({
    url:'/users/update',
    method:'POST',
    data,
  });
}

const updatePassword =(data: IUpdatePassword)=>{
  return request({
    url:'/users/update-password',
    method:'POST',
    data,
  });
}

const changePassword =(data: IUpdatePassword)=>{
  return request({
    url:'/change-password',
    method:'POST',
    data,
  });
}

const getFindAccount = (params: IFindAccount) => {
  return request({
    url: `/users/find-account`,
    method: 'GET',
    params,
  });
};

const getWallets = () => {
  return request({
    url: `/wallets`,
    method: 'GET',
  });
};

const uploadImage = (data: FormData)=>{
  return requestUploadFile({
    url: '/users/upload-image',
    method: 'POST',
    data,
  });
}

const usersSearch = (params: IUsersSearch)=>{
  return requestUploadFile({
    url: '/users/search',
    method: 'GET',
    params,
  });
}

const authSns = (params: IAuthSns)=>{
  return request({
    url: `/redirect/${params?.provider}`,
    method: 'GET',
  });
}

const saveDeviceToken = (data: ISaveDeviceToken)=>{
  return request({
    url: `/users/save-device-token`,
    method: 'POST',
    data,
  });
}

const bodyInformation = (data: IBodyInformation) => {
  return request({
    url: '/users/information-body-confirm',
    method: 'POST',
    data
  })
}

const getHistoriesCycle = (params: IHistoriesCycle) => {
  return request({
    url: `/cycle-histories/index/${params.user_id}`,
    method: 'GET',
    params,
  });
};

const getHistoriesCycleDetail = (params: IHistoriesCycleDetail) => {
  return request({
    url: `/cycle-histories/detail/${params.history_id}`,
    method: 'GET',
    params,
  });
};

export {
  login,
  register,
  emailVerification,
  confirmEmail,
  nations,
  logout,
  leaveGroup,
  refreshToken,
  getProfile,
  updatedUser,
  updatePassword,
  changePassword,
  getFindAccount,
  getWallets,
  uploadImage,
  usersSearch,
  authSns,
  saveDeviceToken,
  bodyInformation,
  getHistoriesCycle,
  getHistoriesCycleDetail
};
