import request from 'app/utils/api/baseAxios';
import { IListNotice, IListHistory } from '../interface/notification.interface';

const listNotice = (params: IListNotice) => {
  return request({
    url: '/notices',
    method: 'GET',
    params,
  });
};

const listQAndA = (params: IListNotice) => {
  return request({
    url: '/qas',
    method: 'GET',
    params,
  });
};
const listCycleHistory = (params: IListHistory) => {
  return request({
    url: `/cycle-histories/detail/${params?.id_history}`,
    method: 'GET',
    params,
  });
};
export { listNotice, listQAndA, listCycleHistory };
