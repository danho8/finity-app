export interface ILogin {
  email: string,
  password: string,
}

export interface IRegister {
  nick_name: string,
  full_name: string,
  nation_id: number | string,
  password: string,
  birthday: string,
  location_detail: string,
  gender: enumGender,
  email: string,
}

export interface IEmailVerification {
  email: string,
  register?: number,
}

export interface IConfirmEmail {
  email: string,
  code: string | number,
}

export enum enumGender {
  male = 1,
  female = 2,
  default = 3,
}

export interface ILeaveGroup {
  password: string,
}

export interface IUpdatedUser {
  nick_name: string,
  full_name: string,
  birthday: string,
}

export interface IUpdatePassword {
  email: string,
  password: string,
  password_confirmation: string,
  password_current: string,
  full_name?: string,
}
export interface IFindAccount {
  email: string,
  full_name: string,
}

export interface IAuthSns {
  provider: string,
}

export interface IUsersSearch {
  search: string,
}

export interface ISaveDeviceToken {
  fcm_token: string,
}

export interface IBodyInformation {
  weight: number,
  height: number
}

export interface IHistoriesCycle {
  user_id: number;
  page?: number;
  paginate_size: number;
}

export interface IHistoriesCycleDetail {
  history_id: number;
}
